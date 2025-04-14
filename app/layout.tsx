import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flow - Your Ride, Your Way",
  description: "Fast, reliable rides at your fingertips. Join thousands of riders and drivers on our platform.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
    <head>
      <link rel="icon" href="/logo.png" />
      <title>Flow - Your Ride, Your Way</title>
    </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <SpeedInsights/>
            <Toaster position="top-center"/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

