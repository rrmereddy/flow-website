"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion"; // Changed from 'motion/react' to match your other files
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  Mail,
  Share2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShineBorder } from "@/components/magicui/shine-border";
import { joinWaitlistAction, WaitlistState } from "./actions";

const initialState: WaitlistState = {
  success: false,
  message: "",
  errors: {},
};

export default function WaitlistPage() {
  const [state, action, isPending] = useActionState(
    joinWaitlistAction,
    initialState,
  );
  const [copied, setCopied] = useState(false);

  // Toast notifications
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success("Welcome aboard!", { description: state.message });
      } else if (!state.errors) {
        toast.error("Error", { description: state.message });
      }
    }
  }, [state]);

  const handleCopy = async () => {
    const textToCopy = "https://roamwithflow.com/";
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Link Copied!", {
        description: "Share link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center items-center p-4 md:p-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 py-5 text-3xl font-bold"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/logo.png"
                width={30}
                height={30}
                alt="Logo Picture"
              />
            </motion.div>
            <motion.span
              className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Flow
            </motion.span>
          </Link>
        </motion.div>

        {state.success ? (
          /* --- SUCCESS STATE (Using your preferred style) --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mx-auto max-w-md w-full shadow-lg relative overflow-hidden">
              {/* Shine Border for Success Card too */}
              <ShineBorder
                shineColor={["#4ade80", "#22c55e", "#16a34a"]} // Green theme for success
                borderWidth={2}
                duration={10}
              />
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  You&apos;re on the list!
                </CardTitle>
                <CardDescription className="text-base">
                  Welcome to the Flow driver community
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4 pb-2">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">
                    You have been successfully signed up. We will notify you via
                    email as soon as we launch driver onboarding in your area.
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {/* <p>Confirmation email sent</p> */}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full">
                  <p className="text-sm text-center mb-2 text-muted-foreground">
                    Help us spread the word
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      href="https://www.linkedin.com/company/ridewithflow/"
                      legacyBehavior
                    >
                      <a target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 hover:text-blue-600 hover:border-blue-200 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-linkedin"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                          <span className="sr-only">Share on LinkedIn</span>
                        </Button>
                      </a>
                    </Link>
                    <Link
                      href="https://www.instagram.com/roamwithflow/profilecard/?igsh=cmRvanYybzNpbWlr"
                      legacyBehavior
                    >
                      <a target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-10 w-10 hover:text-pink-600 hover:border-pink-200 cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-instagram"
                          >
                            <rect
                              width="20"
                              height="20"
                              x="2"
                              y="2"
                              rx="5"
                              ry="5"
                            />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                          </svg>
                          <span className="sr-only">Share on Instagram</span>
                        </Button>
                      </a>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
					className="rounded-full h-10 w-10 hover:text-purple-600 hover:border-purple-200 cursor-pointer"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                      <span className="sr-only">Share link</span>
                    </Button>
                  </div>
                </div>
                <Link href="/" className="w-full">
                  <Button variant="default" className="w-full cursor-pointer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          /* --- FORM STATE (Matched to Signup Page Styling) --- */
          <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg relative overflow-hidden">
            {/* Position ShineBorder within the card container */}
            <ShineBorder
              shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              borderWidth={2}
              duration={10}
            />

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Join Waitlist</h1>
              <p className="text-muted-foreground">
                Sign up early to drive with Flow
              </p>
            </div>

            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
                {state.errors?.name && (
                  <p className="text-sm text-red-500">{state.errors.name[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
                {state.errors?.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex gap-2">
                  <span>We will contact you with onboarding details soon.</span>
                </p>
              </div>

              <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary flex items-center justify-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
