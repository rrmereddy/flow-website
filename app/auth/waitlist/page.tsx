"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Share2, ArrowLeft, Check } from "lucide-react"
import { toast } from "sonner";

export default function Page() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const textToCopy = "https://roamwithflow.com/"; // Replace with your actual share URL

        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);

            // Show toast notification
            toast.success("Link Copied!", {
                description: "Share link copied to clipboard",
            });

            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            toast.error("Failed to copy text", {
                description: "Could not copy link to clipboard",
            });
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4 md:p-8">
            <Card className="mx-auto max-w-md w-full shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">You&apos;re on the waitlist!</CardTitle>
                    <CardDescription className="text-base">Thank you for your interest in our app</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4 pb-2">
                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm">
                            You have been successfully signed up. You will receive an email when we launch the app.
                        </p>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <p>We&apos;ve sent a confirmation to your email</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="w-full">
                        <p className="text-sm text-center mb-2">Help us spread the word</p>
                        <div className="flex justify-center space-x-4">
                            <Link href="https://www.linkedin.com/company/ridewithflow/" legacyBehavior>
                                <a target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                        {/*LinkedIN SVG*/}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round" className="lucide lucide-linkedin-icon lucide-linkedin">
                                            <path
                                                d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                            <rect width="4" height="12" x="2" y="9"/>
                                            <circle cx="4" cy="4" r="2"/>
                                        </svg>
                                        <span className="sr-only">Share on LinkedIn</span>
                                    </Button>
                                </a>
                            </Link>

                            <Link href="https://www.instagram.com/roamwithflow/profilecard/?igsh=cmRvanYybzNpbWlr" legacyBehavior>
                                <a target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                        {/*Instagram SVG*/}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                             strokeLinecap="round" strokeLinejoin="round"
                                             className="lucide lucide-instagram-icon lucide-instagram">
                                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                        </svg>
                                        <span className="sr-only">Share on Instagram</span>
                                    </Button>
                                </a>
                            </Link>

                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full h-10 w-10"
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
                        <Button variant="default" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Landing Page
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            <div className="mt-8 text-center max-w-md">
                <h2 className="text-xl font-semibold mb-2">What happens next?</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start">
            <span className="mr-2 rounded-full bg-primary/10 p-1">
              <CheckCircle className="h-4 w-4 text-primary" />
            </span>
                        <span>We&apos;re working hard to finish the development of our app</span>
                    </li>
                    <li className="flex items-start">
            <span className="mr-2 rounded-full bg-primary/10 p-1">
              <CheckCircle className="h-4 w-4 text-primary" />
            </span>
                        <span>You&apos;ll be among the first to know when we launch</span>
                    </li>
                    <li className="flex items-start">
            <span className="mr-2 rounded-full bg-primary/10 p-1">
              <CheckCircle className="h-4 w-4 text-primary" />
            </span>
                        <span>Early waitlist members will receive exclusive benefits</span>
                    </li>
                </ul>
            </div>

            <footer className="mt-12 text-center text-sm text-muted-foreground">
                <p>
                    Have questions?{" "}
                    <Link href="/#Contact" className="text-primary hover:underline">
                        Contact us
                    </Link>
                </p>
            </footer>
        </div>
    )
}