"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Check, Star, Zap, Download, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import ContactForm from "@/components/ContactForm";
import LegalModal from "@/components/LegalModal";

export default function LandingPage() {
  const [openModal, setOpenModal] = useState<"terms" | "privacy" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const benefitsRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)
  const ctaRef = useRef(null)

  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.2 })
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 })
  const testimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 })

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" width={32} height={32} alt="Flow Logo" priority />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Flow</span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {["Ride", "Drive", "Pricing", "Support"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-full">
                    Sign Up
                  </Button>
                </Link>
              </div>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                {["Ride", "Drive", "Pricing", "Support"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="w-full bg-gray-900 dark:bg-white dark:text-gray-900">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </header>

        <main className="flex-1 pt-16">
          <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            <div className="container mx-auto px-4 md:px-6 pt-20 pb-24 md:pt-32 md:pb-32 relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-2xl"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                    Get there.
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">Together.</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
                    Affordable, safe, and reliable rides—anytime, anywhere.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/auth/signup?role=user">
                      <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-full text-lg px-8 h-14">
                        Ride Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/auth/signup?role=driver">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-900 dark:border-white rounded-full text-lg px-8 h-14">
                        Drive with Flow
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-12 flex items-center gap-8">
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">App Store</div>
                    </div>
                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                      <div className="text-sm text-gray-500 mt-1">Active Riders</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                    <Image
                      src="/screen.png"
                      alt="Flow App"
                      fill
                      className="object-contain p-8"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section id="ride" className="py-20 md:py-32 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div
                ref={benefitsRef}
                initial="hidden"
                animate={benefitsInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Why choose Flow?
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                  Experience the difference of a rideshare service built for you
                </motion.p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    icon: <Zap className="h-10 w-10" />,
                    title: "Fast pickups",
                    description: "Get matched with nearby drivers in seconds. No more waiting around."
                  },
                  {
                    icon: <Shield className="h-10 w-10" />,
                    title: "Transparent pricing",
                    description: "Know exactly what you'll pay upfront. No surge pricing surprises."
                  },
                  {
                    icon: <Check className="h-10 w-10" />,
                    title: "Safety first",
                    description: "All drivers are thoroughly vetted with background checks and vehicle inspections."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-6">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="drive" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div
                ref={howItWorksRef}
                initial="hidden"
                animate={howItWorksInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  How it works
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                  Getting a ride with Flow is quick and easy
                </motion.p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {[
                  {
                    step: "1",
                    title: "Request a ride in seconds",
                    description: "Open the app, set your destination, and get matched instantly"
                  },
                  {
                    step: "2",
                    title: "Match with a nearby driver",
                    description: "See your driver's details, rating, and estimated arrival time"
                  },
                  {
                    step: "3",
                    title: "Pay automatically and rate",
                    description: "Cashless payment and help us maintain quality with your feedback"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="py-20 md:py-32 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div
                ref={testimonialsRef}
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="text-center mb-16"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
                >
                  Trusted by thousands
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                >
                  See what our riders and drivers have to say
                </motion.p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    quote: "Flow has completely changed how I get around campus. Quick, affordable, and the drivers are always friendly!",
                    author: "Sarah M.",
                    role: "Student"
                  },
                  {
                    quote: "As a driver, I love the transparent pricing model. I know exactly what I'm earning on every ride.",
                    author: "James R.",
                    role: "Driver"
                  },
                  {
                    quote: "The app is so easy to use and I feel safe knowing all drivers are thoroughly vetted. Highly recommend!",
                    author: "Emily T.",
                    role: "Commuter"
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="support" ref={ctaRef} className="py-20 md:py-32 bg-gray-900 dark:bg-gray-950 text-white">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div
                initial="hidden"
                animate={ctaInView ? "visible" : "hidden"}
                variants={staggerContainer}
                className="text-center max-w-3xl mx-auto"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold mb-6"
                >
                  Join millions of riders today
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-300 mb-8"
                >
                  Download the Flow app and experience ridesharing done right
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/signup?role=user">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 rounded-full text-lg px-8 h-14">
                      <Download className="mr-2 h-5 w-5" />
                      Get the App
                    </Button>
                  </Link>
                  <Link href="/auth/signup?role=driver">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 rounded-full text-lg px-8 h-14">
                      Become a Driver
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section className="py-12 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 md:px-6">
              <ContactForm />
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800 py-12 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/logo.png" width={32} height={32} alt="Flow Logo" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Flow</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Making transportation seamless, safe, and accessible for everyone.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                  <li><Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
                  <li><Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Help Center</Link></li>
                  <li><Link href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Safety</Link></li>
                  <li><Link href="#support" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setOpenModal("terms")}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Flow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <LegalModal openModal={openModal} onCloseAction={() => setOpenModal(null)} />
      </div>
  )
}
