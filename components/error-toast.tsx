import { toast } from "sonner";
import { logger } from "@/lib/logger";

export default function ErrorToast(toastError: unknown) {
    let errorCode = "unknown";
    logger.log(toastError);
    if (toastError instanceof Error) {
        logger.log("instanceof Error");
        // Check if it's a Firebase error with parentheses: "Firebase: Error (auth/email-already-in-use)."
        const firebaseMatch = toastError.message.match(/\((.*?)\)/);
        if (firebaseMatch && firebaseMatch[1]) {
            errorCode = firebaseMatch[1];
        } else {
            // Check if it's a direct error code like "auth/email-not-verified"
            const directMatch = toastError.message.match(/^(auth\/[a-z-]+)$/);
            if (directMatch && directMatch[1]) {
                errorCode = directMatch[1];
            } else {
                errorCode = toastError.message;
            }
        }
    } else {
        errorCode = String(toastError);
    }
    logger.log("Determined error code:", errorCode);

    switch (errorCode) {
        case "auth/email-already-in-use":
            toast.error("Email already in use", {
                description: "Please use a different email address.",
            });
            break;

        case "passwords/do-not-match":
            toast.error("Passwords don't match", {
                description: "Please make sure your passwords match.",
            });
            break;

        case "auth/user-not-found":
            toast.error("User not found", {
                description: "The email doesn't exist. Please Sign Up.",
            })
            break;

        case "auth/invalid-credential":
            toast.error("Invalid Credentials", {
                description: "The email or password is incorrect. Please try again.",
            })
            break;

        case "auth/email-not-verified":
            toast.error("Email not verified", {
                description: "Please verify your email address.",
            })
            break;

        default:
            toast.error("Error", {
                description: "Error Occurred. Please try again later.",
            });
    }
}
