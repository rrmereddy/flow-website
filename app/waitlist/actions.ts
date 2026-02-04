"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { waitlistSchema, WaitlistFormData } from "@/lib/validations";

// Define the State Type explicitly
export type WaitlistState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
  };
};

// --- Service Layer: Email ---
async function sendWelcomeEmail(data: WaitlistFormData) {
  // TODO: Add Mailgun
  // Placeholder for Mailgun integration
  console.log(
    `[Mock Email] Sending welcome email to ${data.email}`,
  );
}

// Update the function signature to use the type
export async function joinWaitlistAction(
  prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
  };

  const validatedFields = waitlistSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    await addDoc(collection(db, "waitlist"), {
      ...data,
      createdAt: serverTimestamp(),
      source: "web_waitlist_driver_only",
      status: "pending",
    });

    sendWelcomeEmail(data).catch((err) =>
      console.error("Failed to send welcome email:", err),
    );

    return { success: true, message: "Welcome to the Flow driver team!" };
  } catch (error) {
    console.error("Firestore Error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
