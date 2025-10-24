const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {getFunctions} = require("firebase-functions"); // for config
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getStorage } = require("firebase-admin/storage");
const admin = require("firebase-admin");
const Stripe = require("stripe");
const geofire = require("geofire-common")
const dotenv = require("dotenv");
const functions = require("firebase-functions/v2");
const {Expo} = require("expo-server-sdk");
const { FieldValue } = require("firebase-admin/firestore");

// Load .env in local dev
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}


// Load functions config for stripe key using v2-compatible method
let stripeSecretKey = null;
try {
    // v2 Firebase Functions config uses getFunctions().config()
    const functions = getFunctions();
    const config = functions.config ? functions.config() : null;
    
    // Check if we're in production or development
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.FUNCTIONS_EMULATOR !== 'true';
    
    if (config && config.stripe) {
        if(isProduction) {
            console.log("Using LIVE Stripe key from config");
            stripeSecretKey = config.stripe.live_key;
        } else {
            console.log("Using TEST Stripe key from config");
            stripeSecretKey = config.stripe.test_key;
        }
    } else {
        console.log("Functions config loaded: stripe key NOT found");
    }
} catch (e) {
    console.warn(
        "Failed to load functions config, will fallback to .env if available.",
    );
}

// Fallback to environment variables
if (!stripeSecretKey) {
    const isProduction = process.env.NODE_ENV === 'production' || 
                        process.env.FUNCTIONS_EMULATOR !== 'true';
    
    
    if (isProduction && process.env.PROD_STRIPE_SECRET_KEY) {
        stripeSecretKey = process.env.PROD_STRIPE_SECRET_KEY;
        console.log("Using production .env stripe key");
    } else if (!isProduction && process.env.STRIPE_SECRET_KEY) {
        stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        console.log("Using test .env stripe key");
    }
}
else{
    console.log("Using stripe key", stripeSecretKey);
}

if (!stripeSecretKey) {
    throw new Error("Stripe secret key not set - aborting initialization");
}

admin.initializeApp();

const db = admin.firestore();
const bucket = getStorage().bucket();

// Create a new Expo SDK client
const expo = new Expo();

const stripe = new Stripe(stripeSecretKey);

const AVG_SPEED_KM_PER_MINUTE = 0.8; // Approx. 30 mph or 48 km/h
const RIDE_OFFER_TIMEOUT_MS = 10000; // 10 seconds for a driver to respond

const MONTHLY_SUBSCRIPTION_FEE_CENTS = 3000;  // $30.00
const YEARLY_SUBSCRIPTION_FEE_CENTS = 30000; // $300.00
const COMMISSION_FEE_PERCENTAGE = 0.20;       // 20%
const COMMISSION_CAP_CENTS = 4000;            // $40.00

async function getOrCreateStripeCustomer(uid, email) {
    const userDocRef = admin.firestore().collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    let customerId = userDoc.data()?.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({ email });
        customerId = customer.id;
        await userDocRef.update({ stripeCustomerId: customerId });
    } else {
        // Verify the customer still exists in Stripe
        try {
            await stripe.customers.retrieve(customerId);
        } catch (error) {
            console.log(`Customer ${customerId} not found in Stripe, creating new one`);
            // Customer doesn't exist in Stripe, create a new one
            const customer = await stripe.customers.create({ email });
            customerId = customer.id;
            await userDocRef.update({ stripeCustomerId: customerId });
        }
    }

    return customerId;
}

/**
 * Creates all the necessary details to initialize the Stripe Payment Sheet on the client.
 */
exports.createPaymentSheet = onCall(async (request) => {
    try {
        // 1. Create a Stripe Customer
        // This is a best practice for saving payment methods for future use.
        const uid = request.auth?.uid;
        const email = request.auth.token.email;
        const customerId = await getOrCreateStripeCustomer(uid, email);
        console.log("Customer ID:", customerId);

        // 2. Create an Ephemeral Key for the customer
        // This key grants the mobile app temporary, secure access to the customer's details.
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: "2024-06-20" } // Use a consistent API version
        );
        console.log("Ephemeral Key:", ephemeralKey);
        // 3. Create a Setup Intent
        // This tells Stripe you intend to save a payment method for future payments.
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ["card"], // Only allow card payment methods
            usage: "off_session",
            metadata: {
                created_at: new Date().toISOString(),
                source: "createPaymentSheet"
            }
        });
        console.log("Setup Intent:", setupIntent);
        // 4. Return the necessary secrets to the client
        return {
            setupIntent: setupIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customerId,
        };
    } catch (error) {
        console.error("Stripe Error:", error);
        throw new HttpsError(
            "internal",
            "Unable to create Payment Sheet."
        );
    }
});

// Callable HTTPS function to create a Stripe SetupIntent
exports.createSetupIntent = onCall(async (request) => {
    console.log("createSetupIntent called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }
        
        const uid = request.auth?.uid;
        const email = request.auth.token.email;
        
        if (!uid || !email) {
            throw new HttpsError("invalid-argument", "Missing user information");
        }
        
        const customerId = await getOrCreateStripeCustomer(uid, email);
        
        console.log("Creating new setup intent for customer:", customerId);
        
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ["card"],
            usage: "off_session",
            metadata: {
                created_at: new Date().toISOString(),
                source: "createSetupIntent"
            }
        });
        
        console.log("Created setup intent:", setupIntent.id);
        console.log("Setup intent client secret:", setupIntent.client_secret);
        
        return {clientSecret: setupIntent.client_secret};
    } catch (error) {
        console.error("Error creating setup intent:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError(
            "internal",
            "Unable to create setup intent: " + error.message
        );
    }
});

// Callable HTTPS function to list Stripe payment methods
exports.listPaymentMethods = onCall(async (request) => {
    console.log("listPaymentMethods called");
    console.log("listPaymentMethods context.auth:", request.auth);
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }
        
        const uid = request.auth?.uid;
        const email = request.auth.token.email;
        
        if (!uid || !email) {
            throw new HttpsError("invalid-argument", "Missing user information");
        }
        
        console.log("Getting or creating Stripe customer for user:", uid);
        const customerId = await getOrCreateStripeCustomer(uid, email);
        console.log("Customer ID retrieved:", customerId);

        console.log("Fetching payment methods from Stripe for customer:", customerId);
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });
        
        const methods = paymentMethods?.data || [];
        console.log("Found payment methods:", methods.length);
        
        const userDoc = await admin.firestore().collection("users").doc(uid).get();
        const userData = userDoc.data();

        const formattedMethods = methods.map((pm) => ({
            id: pm.id,
            brand: pm.card?.brand || 'Unknown',
            last4: pm.card?.last4 || '****',
            expiry: `${pm.card?.exp_month || '**'}/${pm.card?.exp_year || '**'}`,
            isDefault: pm.id === userData?.defaultPaymentMethodId,
        }));
        
        console.log("Returning formatted payment methods:", formattedMethods);
        return formattedMethods;
        
    } catch (error) {
        console.error("Error in listPaymentMethods:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        // Handle Stripe-specific errors
        if (error.type) {
            throw new HttpsError("internal", `Stripe error: ${error.message}`);
        }
        
        // Handle other errors
        throw new HttpsError("internal", `Failed to fetch payment methods: ${error.message}`);
    }
});

// Callable HTTPS function to create and confirm a Stripe PaymentIntent
exports.createPaymentIntent = onCall(async (request) => {
    console.log("createPaymentIntent called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }

        const {amount, currency, paymentMethodId} = request.data || {};
        if (!amount || !currency || !paymentMethodId) {
            throw new HttpsError("invalid-argument", "Missing parameters");
        }

        const uid = request.auth?.uid;
        const email = request.auth.token.email;
        
        if (!uid || !email) {
            throw new HttpsError("invalid-argument", "Missing user information");
        }
        
        const customerId = await getOrCreateStripeCustomer(uid, email);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            off_session: true,
            confirm: true,
        });
        return {status: paymentIntent.status, id: paymentIntent.id};
    } catch (error) {
        console.error("Error creating payment intent:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError("internal", `Failed to create payment intent: ${error.message}`);
    }
});

// Callable HTTPS function to delete a Stripe PaymentMethod
exports.deletePaymentMethod = onCall(async (request) => {
    console.log("deletePaymentMethod called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }

        const paymentMethodId = request.data?.cardId;
        if (!paymentMethodId) {
            console.log("Missing parameters");
            throw new HttpsError("invalid-argument", "Missing payment method ID");
        }
        
        const response = await stripe.paymentMethods.detach(paymentMethodId);
        console.log("Payment method deleted successfully", response);
        return {
            deleted: true, 
            paymentMethodId: paymentMethodId,
            status: "success"
        };
    } catch (error) {
        console.error("Error deleting payment method:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError("internal", `Failed to delete payment method: ${error.message}`);
    }
});

// Callable HTTPS function to refund a payment
exports.refundPayment = onCall(async (request) => {
    console.log("refundPayment called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }

        const { paymentIntentId, reason } = request.data || {};
        if (!paymentIntentId) {
            throw new HttpsError("invalid-argument", "Missing payment intent ID");
        }
        
        console.log(`Processing refund for payment intent: ${paymentIntentId}, reason: ${reason}`);
        
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            reason: reason || 'requested_by_customer',
            metadata: {
                refunded_at: new Date().toISOString(),
                reason: reason || 'ride_cancelled'
            }
        });
        
        console.log("Refund created successfully:", refund.id);
        return {
            refundId: refund.id,
            status: refund.status,
            amount: refund.amount,
            success: true
        };
    } catch (error) {
        console.error("Error creating refund:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError("internal", `Failed to create refund: ${error.message}`);
    }
});

// Callable HTTPS function to create a payment intent with authorization (not immediate charge)
exports.createAuthorizedPayment = onCall(async (request) => {
    console.log("createAuthorizedPayment called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }

        const {amount, currency, paymentMethodId} = request.data || {};
        if (!amount || !currency || !paymentMethodId) {
            throw new HttpsError("invalid-argument", "Missing parameters");
        }

        const uid = request.auth?.uid;
        const email = request.auth.token.email;
        
        if (!uid || !email) {
            throw new HttpsError("invalid-argument", "Missing user information");
        }
        
        const customerId = await getOrCreateStripeCustomer(uid, email);

        // Create payment intent with capture_method: 'manual' to authorize but not capture
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            capture_method: 'manual', // This authorizes but doesn't capture the payment
            off_session: true,
            confirm: true,
            metadata: {
                created_at: new Date().toISOString(),
                source: "createAuthorizedPayment",
                status: "authorized"
            }
        });
        
        console.log("Authorized payment created:", paymentIntent.id);
        return {
            status: paymentIntent.status, 
            id: paymentIntent.id,
            client_secret: paymentIntent.client_secret
        };
    } catch (error) {
        console.error("Error creating authorized payment:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError("internal", `Failed to create authorized payment: ${error.message}`);
    }
});

// Callable HTTPS function to capture an authorized payment
exports.capturePayment = onCall(async (request) => {
    console.log("capturePayment called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }

        const { paymentIntentId } = request.data || {};
        if (!paymentIntentId) {
            throw new HttpsError("invalid-argument", "Missing payment intent ID");
        }
        
        console.log(`Capturing payment intent: ${paymentIntentId}`);
        
        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
        
        console.log("Payment captured successfully:", paymentIntent.id);
        return {
            status: paymentIntent.status,
            id: paymentIntent.id,
            success: true
        };
    } catch (error) {
        console.error("Error capturing payment:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError("internal", `Failed to capture payment: ${error.message}`);
    }
});

// Callable HTTPS function to cancel a ride and process refund
exports.cancelRide = onCall(async (request) => {
    console.log("cancelRide called");
    
    try {
        if (!request.auth) {
            throw new HttpsError("unauthenticated", "User must be logged in");
        }

        const { rideId, reason } = request.data || {};
        if (!rideId) {
            throw new HttpsError("invalid-argument", "Missing ride ID");
        }
        
        const uid = request.auth.uid;
        
        // Get the ride document
        const rideRef = db.collection('ride_requests').doc(rideId);
        const rideDoc = await rideRef.get();
        
        if (!rideDoc.exists) {
            throw new HttpsError("not-found", "Ride not found");
        }
        
        const rideData = rideDoc.data();
        
        // Check if user is authorized to cancel this ride
        if (rideData.rider_id !== uid) {
            throw new HttpsError("permission-denied", "You can only cancel your own rides");
        }
        
        // Check if ride can be cancelled
        if (rideData.status === 'completed' || rideData.status === 'canceled' || rideData.status === 'in_progress') {
            throw new HttpsError("failed-precondition", "Ride cannot be cancelled in current status");
        }
        
        console.log(`Cancelling ride ${rideId} by user ${uid}, reason: ${reason}`);
        
        // Process refund if payment was made
        let refundResult = null;
        if (rideData.payment_intent_id) {
            try {
                console.log(`Processing refund for cancelled ride: ${rideId}`);
                const refund = await stripe.refunds.create({
                    payment_intent: rideData.payment_intent_id,
                    reason: 'requested_by_customer',
                    metadata: {
                        ride_id: rideId,
                        reason: reason || 'ride_cancelled',
                        cancelled_by: uid,
                        refunded_at: new Date().toISOString()
                    }
                });
                console.log(`Refund created successfully: ${refund.id}`);
                refundResult = {
                    refundId: refund.id,
                    status: refund.status,
                    amount: refund.amount
                };
            } catch (refundError) {
                console.error(`Failed to create refund for ride ${rideId}:`, refundError);
                // Continue with cancellation even if refund fails
            }
        }
        
        // Update ride document
        const updateData = {
            status: "canceled",
            canceledAt: FieldValue.serverTimestamp(),
            canceledBy: "rider",
            cancelReason: reason || "ride_cancelled"
        };
        
        if (refundResult) {
            updateData.refund_id = refundResult.refundId;
            updateData.refunded_at = FieldValue.serverTimestamp();
            updateData.refund_reason = reason || "ride_cancelled";
        }
        
        await rideRef.update(updateData);
        
        console.log(`Ride ${rideId} cancelled successfully`);
        return {
            success: true,
            rideId: rideId,
            refund: refundResult
        };
        
    } catch (error) {
        console.error("Error cancelling ride:", error);
        
        if (error instanceof HttpsError) {
            throw error;
        }
        
        throw new HttpsError("internal", `Failed to cancel ride: ${error.message}`);
    }
});



/**
 * Helper function to send push notifications
 * @param {string} expoPushToken The Expo push token
 * @param {string} title The notification title
 * @param {string} body The notification body
 * @param {Object} data Additional data
 * @return {Promise<boolean>} Success status
 */
async function sendPushNotification(expoPushToken, title, body, data = {}) {
    if (!Expo.isExpoPushToken(expoPushToken)) {
        console.error(
            `Push token ${expoPushToken} is not a valid Expo push token`,
        );
        return false;
    }

    const message = {
        to: expoPushToken,
        sound: "default",
        title: title,
        body: body,
        data: data,
    };

    try {
        const chunks = expo.chunkPushNotifications([message]);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo
                    .sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error("Error sending push notification:", error);
            }
        }

        console.log("Push notification sent successfully");
        return true;
    } catch (error) {
        console.error("Error sending push notification:", error);
        return false;
    }
}

// Function to send notification when driver arrives
exports.notifyRiderDriverArrived = functions.firestore.onDocumentUpdated(
    "ride_requests/{rideId}",
    async (event) => {
        console.log(" Function triggered for ride:", event.params.rideId);

        const before = event.data.before.data();
        const after = event.data.after.data();

        console.log("🔔 Before status:", before.status);
        console.log("🔔 After status:", after.status);

        // Check if ride status changed to "driver_arrived"
        if (before.status !== "driver_arrived" &&
            after.status === "driver_arrived") {
            const riderId = after.rider_id;
            console.log("🔔 Rider ID:", riderId);

            // Get rider's push token
            const riderDoc = await admin.firestore()
                .collection("users").doc(riderId).get();
            if (riderDoc.exists) {
                const riderData = riderDoc.data();
                const expoPushToken = riderData.expoPushToken;
                console.log("🔔 Push token found:", expoPushToken ? "YES" : "NO");
                console.log("🔔 Push token:", expoPushToken);

                if (expoPushToken) {
                    const result = await sendPushNotification(
                        expoPushToken,
                        "Driver Arrived! 🚗",
                        "Your driver has arrived at the pickup location.",
                        {
                            type: "driver_arrived",
                            rideId: event.params.rideId,
                            screen: "RideStatus",
                        },
                    );
                    console.log("🔔 Notification result:", result);
                } else {
                    console.log("🔔 No push token found for rider");
                }
            } else {
                console.log("🔔 Rider document not found");
            }
        } else {
            console.log("🔔 Status change not relevant:", 
                before.status, "->", after.status);
        }
    },
);

// Function to send notification when driver account is verified
exports.notifyDriverAccountVerified = functions.firestore.onDocumentUpdated(
    "drivers/{driverId}",
    async (event) => {
        const before = event.data.before.data();
        const after = event.data.after.data();

        // Check if verification status changed to verified
        if (before.verified !== true && after.verified === true) {
            const driverId = event.params.driverId;

            // Get driver's push token
            const driverDoc = await admin.firestore()
                .collection("drivers").doc(driverId).get();
            if (driverDoc.exists) {
                const driverData = driverDoc.data();
                const expoPushToken = driverData.expoPushToken;

                if (expoPushToken) {
                    await sendPushNotification(
                        expoPushToken,
                        "Account Verified! ✅",
                        "Your driver account has been successfully verified. " +
                        "You can now start accepting rides!",
                        {
                            type: "account_verified",
                            screen: "DriverView",
                        },
                    );
                }
            }
        }
    },
);

/**
 * Triggered when a new ride request is created.
 * It finds and ranks potential drivers and offers the ride sequentially.
 */
exports.assignRideRequest = onDocumentCreated("ride_requests/{rideId}", async (event) => {
    const rideId = event.params.rideId;
    const rideRequest = event.data.data();

    console.log(`[${rideId}] Starting assignment process.`);

    try {
        // Find and rank all suitable drivers based on availability and proximity.
        const rankedDrivers = await findAndRankDrivers(rideRequest.pickup_location);

        if (rankedDrivers.length === 0) {
            console.log(`[${rideId}] No drivers found. Setting status to 'no_drivers_available'.`);
            
            // Refund the payment since no drivers are available
            if (rideRequest.payment_intent_id) {
                try {
                    console.log(`[${rideId}] Processing refund for no drivers available`);
                    const refund = await stripe.refunds.create({
                        payment_intent: rideRequest.payment_intent_id,
                        reason: 'requested_by_customer',
                        metadata: {
                            ride_id: rideId,
                            reason: 'no_drivers_available',
                            refunded_at: new Date().toISOString()
                        }
                    });
                    console.log(`[${rideId}] Refund created successfully: ${refund.id}`);
                    
                    // Update ride document with refund info
                    await event.data.ref.update({ 
                        status: "no_drivers_available",
                        refund_id: refund.id,
                        refunded_at: FieldValue.serverTimestamp(),
                        refund_reason: "no_drivers_available"
                    });
                } catch (refundError) {
                    console.error(`[${rideId}] Failed to create refund:`, refundError);
                    // Still update status even if refund fails
                    await event.data.ref.update({ 
                        status: "no_drivers_available",
                        refund_error: refundError.message
                    });
                }
            } else {
                await event.data.ref.update({ status: "no_drivers_available" });
            }
            return;
        }

        console.log(`[${rideId}] Found ${rankedDrivers.length} potential drivers. Starting offer sequence.`);

        // Offer the ride to each driver in the queue, one by one.
        for (const driver of rankedDrivers) {
            console.log(`[${rideId}] Offering ride to driver ${driver.id} with score ${driver.score}.`);
            const accepted = await offerRideToDriver(driver, rideId);

            console.log(accepted);
            if (accepted) {
                console.log(`[${rideId}] Ride accepted by driver ${driver.id}.`);
                const driverDoc = await db.collection("drivers").doc(driver.id).get();
                let driverInfo = {};
                if (driverDoc.exists) {
                    const driverData = driverDoc.data();
                    let photoUrl = null;

                    const photoDirectory = `drivers/${driver.id}/profile/`;
                    const [files] = await bucket.getFiles({ prefix: photoDirectory});
                    if (files.length > 0){
                        const profilePhotoFile = files[0];
                        const [signedUrl] = await profilePhotoFile.getSignedUrl({
                            action: 'read',
                            expires: '01-01-2050',
                        });
                        photoUrl = signedUrl;
                    }
                    console.log('photourl', photoUrl);
                    driverInfo = {
                        firstName: driverData.firstName || 'Driver',
                        profilePhotoUrl: photoUrl,
                        rating: driverData.rating || 5,
                        vehicle: driverData.vehicle || { make: 'Unknown', model: 'Car', color: '', licensePlate: '' }
                    };
                }
                
                // Capture the payment now that driver has accepted
                if (rideRequest.payment_intent_id) {
                    try {
                        console.log(`[${rideId}] Capturing payment for accepted ride`);
                        await stripe.paymentIntents.capture(rideRequest.payment_intent_id);
                        console.log(`[${rideId}] Payment captured successfully`);
                    } catch (captureError) {
                        console.error(`[${rideId}] Failed to capture payment:`, captureError);
                        // Continue with ride acceptance even if payment capture fails
                        // The payment will remain authorized and can be captured later
                    }
                }
                
                await event.data.ref.update({
                    status: "accepted",
                    driver_id: driver.id,
                    driverInfo: driverInfo,
                    accepted_at: FieldValue.serverTimestamp(),
                });

                // Notify the rider that a driver is on the way.
                const riderDoc = await db.collection("users").doc(rideRequest.rider_id).get();
                if (riderDoc.exists && riderDoc.data().expoPushToken) {
                    await sendPushNotification(
                        riderDoc.data().expoPushToken,
                        "Your driver is on the way!",
                        `${driver.name || 'A driver'} has accepted your ride request.`,
                        { rideId }
                    );
                }
                return; // End the function successfully.
            } else {
                console.log(`[${rideId}] Driver ${driver.id} rejected or timed out. Moving to next driver.`);
            }
        }

        // If the loop finishes, no driver accepted.
        console.log(`[${rideId}] No drivers accepted the ride. Setting status to 'no_drivers_available'.`);
        
        // Refund the payment since no drivers accepted
        if (rideRequest.payment_intent_id) {
            try {
                console.log(`[${rideId}] Processing refund for no drivers accepted`);
                const refund = await stripe.refunds.create({
                    payment_intent: rideRequest.payment_intent_id,
                    reason: 'requested_by_customer',
                    metadata: {
                        ride_id: rideId,
                        reason: 'no_drivers_accepted',
                        refunded_at: new Date().toISOString()
                    }
                });
                console.log(`[${rideId}] Refund created successfully: ${refund.id}`);
                
                // Update ride document with refund info
                await event.data.ref.update({ 
                    status: "no_drivers_available",
                    refund_id: refund.id,
                    refunded_at: FieldValue.serverTimestamp(),
                    refund_reason: "no_drivers_accepted"
                });
            } catch (refundError) {
                console.error(`[${rideId}] Failed to create refund:`, refundError);
                // Still update status even if refund fails
                await event.data.ref.update({ 
                    status: "no_drivers_available",
                    refund_error: refundError.message
                });
            }
        } else {
            await event.data.ref.update({ status: "no_drivers_available" });
        }

    } catch (error) {
        console.error(`[${rideId}] An error occurred during assignment:`, error);
        await event.data.ref.update({ status: "error" });
    }
});

exports.updateRideWithDriverLocation = onDocumentUpdated("drivers/{driverId}", async (event) => {
    const driverDataAfter = event.data.after.data();
    const driverDataBefore = event.data.before.data();

    // 1. Safety Check: Only proceed if the driver has an active ride.
    if (!driverDataAfter.activeRideId) {
        return null; // Exit if the driver is not on a trip.
    }

    // 2. Safety Check: Ensure coordinates exist on both before and after snapshots.
    const coordsBefore = driverDataBefore.coordinates;
    const coordsAfter = driverDataAfter.coordinates;
    if (!coordsBefore || !coordsAfter) {
        return null; // Exit if location data is missing.
    }

    // 3. Correct Comparison: Compare latitude and longitude values, not object references.
    const locationChanged = coordsBefore.latitude !== coordsAfter.latitude || coordsBefore.longitude !== coordsAfter.longitude;

    if (locationChanged) {
        console.log(`Driver ${event.params.driverId} location changed. Updating ride ${driverDataAfter.activeRideId}.`);
        const rideRef = db.collection('ride_requests').doc(driverDataAfter.activeRideId);
        
        // Copy the new location into the ride document for the rider to see.
        return rideRef.update({
            driverLocation: coordsAfter
        });
    }

    return null; // Location did not change, so no update is needed.
});

/**
 * Finds all online drivers and ranks them based on their availability and
 * estimated time to the pickup location.
 * @param {admin.firestore.GeoPoint} pickupLocation - The ride's pickup location.
 * @returns {Promise<Array<Object>>} A sorted array of driver objects with their scores.
 */
async function findAndRankDrivers(pickupLocation) {
    if (!pickupLocation || typeof pickupLocation.latitude !== 'number' || typeof pickupLocation.longitude !== 'number') {
        console.error("Invalid pickupLocation provided to findAndRankDrivers:", pickupLocation);
        return [];
    }
    const center = [pickupLocation.latitude, pickupLocation.longitude];
    const radiusInM = 5 * 1000; // 5km

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const promises = [];

    for (const b of bounds) {
        const q = db.collection('drivers')
            .where('online', '==', true)
            .orderBy('g.geohash')
            .startAt(b[0])
            .endAt(b[1]);
        promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const matchingDocs = [];
    for (const snap of snapshots) {
        for (const doc of snap.docs) {
            const coords = doc.get('coordinates');
            if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
                const lat = coords.latitude;
                const lng = coords.longitude;

                const distanceInKm = geofire.distanceBetween([lat, lng], center);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radiusInM) {
                    matchingDocs.push(doc);
                }
            }
        }
    }
    
    if (matchingDocs.length === 0) return [];
    
    const driverPromises = matchingDocs.map(async (doc) => {
        const driver = { id: doc.id, ...doc.data() };
        let score = Infinity;
        const driverCoords = driver.coordinates;

        if (driver.status === 'available' && driverCoords) {
            const distance = geofire.distanceBetween([driverCoords.latitude, driverCoords.longitude], center);
            score = distance; // Score by distance in km
        }
        // ... include scoring logic for 'on_trip' drivers if needed ...
        return { ...driver, score };
    });

    const driversWithScores = await Promise.all(driverPromises);
    
    return driversWithScores
        .filter(d => d.score !== Infinity)
        .sort((a, b) => a.score - b.score);
}

/**
 * Offers a ride to a single driver and waits for a response.
 * @param {Object} driver - The driver object.
 * @param {string} rideId - The ID of the ride request.
 * @returns {Promise<boolean>} True if the driver accepts, false otherwise.
 */
async function offerRideToDriver(driver, rideId) {
    const responseRef = db.collection("driver_responses").doc(rideId);
    // Set the new offer details, overwriting any previous offer for this rideId.
    await responseRef.set({
        driverId: driver.id,
        rideId: rideId,
        offeredAt: FieldValue.serverTimestamp(),
        response: null // 'accepted', 'rejected', or null
    });

    console.log(driver.expoPushToken)
    
    // Send a push notification to the driver about the new offer.
    if (driver.expoPushToken) {
        await sendPushNotification(
            driver.expoPushToken,
            "New Ride Request!",
            "You have a new ride available. Tap to respond.",
            { rideId, type: 'new_ride_request' }
        );
    }
    console.log('waiting for driver response');

    return await waitForDriverResponse(responseRef, RIDE_OFFER_TIMEOUT_MS);
}

/**
 * Listens to a driver_responses document for a specific duration.
 * @param {admin.firestore.DocumentReference} responseRef - The reference to the response document.
 * @param {number} timeoutMs - The time to wait in milliseconds.
 * @returns {Promise<boolean>} True if accepted, false if rejected or timed out.
 */
function waitForDriverResponse(responseRef, timeoutMs) {
    return new Promise((resolve) => {
        let timeoutId = null;

        const unsubscribe = responseRef.onSnapshot((doc) => {
            if (doc.exists) {
                const data = doc.data();
                if (data.response === "accepted") {
                    if(timeoutId) clearTimeout(timeoutId);
                    unsubscribe();
                    resolve(true);
                } else if (data.response === "rejected") {
                    if(timeoutId) clearTimeout(timeoutId);
                    unsubscribe();
                    resolve(false);
                }
            }
        });

        timeoutId = setTimeout(() => {
            unsubscribe();
            resolve(false); // Resolve as false if the timer runs out.
        }, timeoutMs);
    });
}

// --- DRIVER PAYOUTS & PLATFORM FEES ---

/**
 * Creates a Stripe Connect account link for a driver to onboard.
 * This is the first step to enable payouts.
 */
exports.createStripeAccountLink = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in.");
    }
    
    // Get parameters from the caller
    const { platform = 'mobile' } = request.data || {};
    
    const driverId = request.auth.uid;
    const driverRef = db.collection('drivers').doc(driverId);
    const driverDoc = await driverRef.get();

    if (!driverDoc.exists) {
        throw new HttpsError("not-found", "Driver profile not found.");
    }

    let accountId = driverDoc.data().stripeAccountId;

    if (!accountId) {
        const account = await stripe.accounts.create({
            type: 'express',
            email: request.auth.token.email,
        });
        accountId = account.id;
        await driverRef.update({ stripeAccountId: accountId });
    }

    const projectId = 'flow-test-28d76';
    
    // Set different URLs based on platform
    let refreshUrl, returnUrl;
    if (platform === 'web') {
        refreshUrl = `http://localhost:3000/stripe-refresh`;
        returnUrl = `http://localhost:3000/stripe-return?account=${accountId}`;
    } else {
        // Mobile app URLs (you can customize these as needed)
        refreshUrl = `https://${projectId}.web.app/stripe-refresh.html`;
        returnUrl = `https://${projectId}.web.app/stripe-return.html?account=${accountId}`;
    }
    
    const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
    });

    return { url: accountLink.url };
});

/**
 * Verifies the status of a Stripe Connect account to ensure it's properly set up.
 */
exports.verifyStripeAccountStatus = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "You must be logged in.");
    }
    
    const { accountId } = request.data || {};
    
    if (!accountId) {
        throw new HttpsError("invalid-argument", "Account ID is required.");
    }
    
    try {
        // Retrieve the account from Stripe to check its status
        const account = await stripe.accounts.retrieve(accountId);
        
        // Check if the account is properly set up
        // An account is considered complete when:
        // - charges_enabled is true (can accept payments)
        // - payouts_enabled is true (can receive payouts)
        // - details_submitted is true (has submitted required information)
        const isComplete = account.charges_enabled && 
                          account.payouts_enabled && 
                          account.details_submitted;
        
        return {
            success: isComplete,
            account: {
                id: account.id,
                charges_enabled: account.charges_enabled,
                payouts_enabled: account.payouts_enabled,
                details_submitted: account.details_submitted,
                requirements: account.requirements
            }
        };
    } catch (error) {
        console.error('Error verifying Stripe account:', error);
        throw new HttpsError("internal", "Failed to verify Stripe account status.");
    }
});

/**
 * [MODIFIED] Scheduled function to process driver payouts every week based on their paymentStyle.
 */
exports.processWeeklyPayouts = onSchedule("every sunday 02:00", async (event) => {
    console.log("Running weekly payout process...");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const ridesToPayQuery = db.collection('ride_requests')
        .where('status', '==', 'completed')
        .where('payout_status', '==', 'pending')
        .where('created_at', '>=', oneWeekAgo);

    const snapshot = await ridesToPayQuery.get();
    if (snapshot.empty) {
        console.log("No rides to pay out this week.");
        return null;
    }

    // Group rides by driver
    const ridesByDriver = {};
    snapshot.forEach(doc => {
        const ride = { id: doc.id, ...doc.data() };
        if (!ridesByDriver[ride.driver_id]) {
            ridesByDriver[ride.driver_id] = [];
        }
        ridesByDriver[ride.driver_id].push(ride);
    });

    for (const driverId in ridesByDriver) {
        try {
            const driverRef = db.collection('drivers').doc(driverId);
            const driverDoc = await driverRef.get();
            if (!driverDoc.exists) continue;

            const driverData = driverDoc.data();
            const stripeAccountId = driverData.stripeAccountId;
            const paymentStyle = driverData.paymentStyle || 'commission'; // Default to commission
            let totalPayout = 0;
            let currentMonthCommission = driverData.currentMonthCommissionPaid || 0;

            const rides = ridesByDriver[driverId];

            if (paymentStyle === 'monthly' || paymentStyle === 'yearly') {
                // Subscription drivers earn 100% of the ride fare
                rides.forEach(ride => {
                    totalPayout += parseFloat(ride.estimated_price.replace('$', '')) * 100;
                });
            } else if (paymentStyle === 'commission') {
                // Commission drivers have a capped fee
                rides.forEach(ride => {
                    const ridePrice = parseFloat(ride.estimated_price.replace('$', '')) * 100;
                    let commissionForThisRide = 0;

                    if (currentMonthCommission < COMMISSION_CAP_CENTS) {
                        const potentialCommission = ridePrice * COMMISSION_FEE_PERCENTAGE;
                        const remainingCap = COMMISSION_CAP_CENTS - currentMonthCommission;
                        
                        commissionForThisRide = Math.min(potentialCommission, remainingCap);
                        currentMonthCommission += commissionForThisRide;
                    }
                    
                    totalPayout += (ridePrice - commissionForThisRide);
                });
                // Update the driver's total commission paid for the month
                await driverRef.update({ currentMonthCommissionPaid: currentMonthCommission });
            }

            if (stripeAccountId && totalPayout > 0) {
                await stripe.transfers.create({
                    amount: Math.round(totalPayout),
                    currency: 'usd',
                    destination: stripeAccountId,
                    description: 'Weekly ride earnings payout'
                });

                const batch = db.batch();
                rides.forEach(ride => {
                    const rideRef = db.collection('ride_requests').doc(ride.id);
                    batch.update(rideRef, { payout_status: 'paid' });
                });
                await batch.commit();

                console.log(`Successfully paid out ${totalPayout / 100} to driver ${driverId}`);
            } else if (!stripeAccountId) {
                console.warn(`Driver ${driverId} has earnings but no Stripe account ID.`);
            }
        } catch (error) {
            console.error(`Failed to process payout for driver ${driverId}:`, error);
        }
    }
    return null;
});


/**
 * [MODIFIED] Scheduled function to manage driver subscriptions and commission resets.
 * Runs daily to handle different subscription types and monthly resets.
 */
exports.manageDriverSubscriptions = onSchedule("every day 03:00", async (event) => {
    console.log("Running daily driver subscription management...");
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;

    const driversQuery = db.collection('drivers').where('online', '==', true);
    const snapshot = await driversQuery.get();

    for (const doc of snapshot.docs) {
        const driverId = doc.id;
        const driver = doc.data();
        const paymentStyle = driver.paymentStyle || 'commission';

        // --- Handle Commission Reset ---
        if (isFirstDayOfMonth && paymentStyle === 'commission') {
            await db.collection('drivers').doc(driverId).update({ currentMonthCommissionPaid: 0 });
            console.log(`Reset monthly commission for driver ${driverId}`);
        }

        // --- Handle Subscription Payments ---
        const customerId = driver.stripeCustomerId; 
        const defaultPaymentMethod = driver.defaultPaymentMethodId;
        const lastPayment = driver.lastSubscriptionPaymentDate?.toDate();
        let shouldCharge = false;
        let amountToCharge = 0;

        if (paymentStyle === 'monthly') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (!lastPayment || lastPayment < oneMonthAgo) {
                shouldCharge = true;
                amountToCharge = MONTHLY_SUBSCRIPTION_FEE_CENTS;
            }
        } else if (paymentStyle === 'yearly') {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            if (!lastPayment || lastPayment < oneYearAgo) {
                shouldCharge = true;
                amountToCharge = YEARLY_SUBSCRIPTION_FEE_CENTS;
            }
        }
        
        if (shouldCharge && customerId && defaultPaymentMethod) {
            try {
                await stripe.paymentIntents.create({
                    amount: amountToCharge,
                    currency: 'usd',
                    customer: customerId,
                    payment_method: defaultPaymentMethod,
                    off_session: true,
                    confirm: true,
                    description: `Driver ${paymentStyle} subscription fee`
                });
                await db.collection('drivers').doc(driverId).update({ lastSubscriptionPaymentDate: today });
                console.log(`Successfully collected ${paymentStyle} fee from driver ${driverId}`);
            } catch (error) {
                console.error(`Failed to collect ${paymentStyle} fee from driver ${driverId}:`, error.message);
            }
        } else if (shouldCharge) {
            console.warn(`Driver ${driverId} needs a ${paymentStyle} payment, but has no payment method.`);
        }
    }
    return null;
});

/**
 * Scheduled function that runs periodically to detect and mark stale drivers as offline.
 * This handles cases where a driver's app is killed or loses connection without
 * gracefully signing out.
 */
exports.cleanupStaleDrivers = onSchedule("every 5 minutes", async (event) => {
    console.log("Running stale driver cleanup job...");

    // A driver is considered stale if their last heartbeat was more than 2 minutes ago.
    const STALE_THRESHOLD_MINUTES = 2;
    const now = new Date();
    const threshold = new Date(now.getTime() - STALE_THRESHOLD_MINUTES * 60 * 1000);

    try {
        const staleDriversQuery = db.collection('drivers')
            .where('online', '==', true)
            .where('lastHeartbeat', '<', threshold);

        const snapshot = await staleDriversQuery.get();

        if (snapshot.empty) {
            console.log("No stale drivers found.");
            return null;
        }

        console.log(`Found ${snapshot.size} stale drivers to mark as offline.`);

        const batch = db.batch();
        snapshot.forEach(doc => {
            console.log(`Marking driver ${doc.id} as offline.`);
            const driverRef = db.collection('drivers').doc(doc.id);
            batch.update(driverRef, {
                online: false,
                status: 'offline'
            });
        });

        await batch.commit();
        console.log("Successfully cleaned up stale drivers.");
        return null;

    } catch (error) {
        console.error("Error during stale driver cleanup:", error);
        return null;
    }
});