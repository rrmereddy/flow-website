import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ride with Flow – Safe, Affordable, and Reliable Rides",
  description: "Download Flow to get fast, affordable rides at your fingertips. Drive and earn on your schedule.",
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
      <title>Ride with Flow – Safe, Affordable, and Reliable Rides</title>
    </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <SpeedInsights/>
            <Analytics/>
            <Toaster position="top-center"/>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

