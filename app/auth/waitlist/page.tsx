import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Share2, ArrowLeft, Twitter, Facebook, Linkedin } from "lucide-react"

export default function Page() {
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
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                <Twitter className="h-4 w-4" />
                                <span className="sr-only">Share on Twitter</span>
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                <Facebook className="h-4 w-4" />
                                <span className="sr-only">Share on Facebook</span>
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                <Linkedin className="h-4 w-4" />
                                <span className="sr-only">Share on LinkedIn</span>
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                <Share2 className="h-4 w-4" />
                                <span className="sr-only">Share link</span>
                            </Button>
                        </div>
                    </div>
                    <Link href="/" className="w-full">
                        <Button variant="default" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Homepage
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
