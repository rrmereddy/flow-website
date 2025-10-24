// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { connectFunctionsEmulator, getFunctions } from "firebase/functions"
import { logger } from "./logger"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
const functions = getFunctions(app, "us-central1");
logger.info('Functions:', functions);

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'development') {
  try {
    // Connect to Functions emulator - use localhost for web development
    connectFunctionsEmulator(functions, 'localhost', 5001);
    logger.info('Connected to Functions emulator at localhost:5001');
  } catch (error: unknown) {
    // Only log error if it's not already connected
    if (!(error as Error).message.includes('already been called')) {
      logger.error('Failed to connect to emulators:', (error as Error).message);
    }
  }
}

export { auth, db, storage, functions }

