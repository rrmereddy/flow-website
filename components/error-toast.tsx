import { toast } from "sonner";

export default function ErrorToast(toastError: unknown) {
    let errorCode = "unknown";

    if (toastError instanceof Error) {
        // Firebase errors usually look like: "Firebase: Error (auth/email-already-in-use)."
        const match = toastError.message.match(/\((.*?)\)/);
        if (match && match[1]) {
            errorCode = match[1];
        }
    } else {
        errorCode = String(toastError);
    }

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
