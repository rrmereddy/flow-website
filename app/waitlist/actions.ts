"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { waitlistSchema } from "@/lib/validations";

export type WaitlistState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    email?: string[];
  };
};

async function sendWelcomeEmail(email: string) {
  //TODO: add mailgun
  console.log(`[Mock Email] Sending welcome email to ${email} (Driver)`);
}

export async function joinWaitlistAction(
  prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
  };

  // 1. Validate Input Format
  const validatedFields = waitlistSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    const waitlistRef = collection(db, "waitlist");

    // 2. Check for Duplicates (The new validation)
    const q = query(waitlistRef, where("email", "==", data.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If we found a match, return an error immediately
      return {
        success: false,
        errors: {
          email: ["This email is already on the waitlist."],
        },
        message: "You are already on the list!",
      };
    }

    // 3. Save if unique
    await addDoc(waitlistRef, {
      ...data,
      createdAt: serverTimestamp(),
      source: "web_waitlist_driver_only",
      status: "pending",
    });

    sendWelcomeEmail(data.email).catch((err) =>
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
