'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Clock,
  MapPin,
  Shield,
  Check,
  DollarSign,
  Calendar,
  Percent,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { AnimatedText } from '@/lib/AnimatedText'
import ContactForm from '@/components/ContactForm'
import { PrototypeCarousel } from '@/components/PrototypeCarousel'
import { ShinyButton } from '@/components/magicui/shiny-button'
import LegalModal from '@/components/LegalModal'

export default function LandingPage() {
  // For parallax scrolling effect
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 1000], [0, 200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -200])

  const [openModal, setOpenModal] = useState<'terms' | 'privacy' | null>(null)

  // Refs for scroll animations
  const missionRef = useRef(null)
  const featuresRef = useRef(null)
  const pricingRef = useRef(null)
  const aboutRef = useRef(null)
  const faqRef = useRef(null)
  const contactRef = useRef(null)

  // InView states
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const pricingInView = useInView(pricingRef, { once: true, amount: 0.3 })
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 })
  const contactInView = useInView(contactRef, { once: true, amount: 0.3 })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  } as const // <--- ADD THIS HERE

  const fadeInUpVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
        duration: 0.6,
      },
    },
  } as const

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const featureCardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
    hover: {
      y: -10,
      scale: 1.05,
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  } as const

  const founderCardVariants = {
    hidden: { y: 50, opacity: 0, rotateY: 30 },
    visible: {
      y: 0,
      opacity: 1,
      rotateY: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  } as const

  // Pulse animation for hero circle
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    } as const, // <--- Add this
  }

  return (
    // Removed "overflow-hidden" from the outer div
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      <header className="bg-opacity-90 sticky top-0 z-40 border-b border-blue-950 bg-transparent backdrop-blur-sm dark:border-gray-800">
        <div className="flex h-16 items-center justify-around px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
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
                  priority
                />
              </motion.div>
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                Flow
              </motion.span>
            </Link>
          </motion.div>

          <nav className="hidden gap-6 md:flex">
            {['Mission', 'Features', 'Pricing', 'About', 'FAQ', 'Contact'].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {/* Wrap link text in a relative container with an animated underline */}
                  <Link
                    href={`/#${item}`}
                    className="text-md relative font-medium text-blue-500 dark:text-blue-400"
                  >
                    <motion.span
                      className="relative"
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                    >
                      {item}
                      <motion.div
                        variants={{
                          rest: { width: 0 },
                          hover: { width: '100%' },
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute -bottom-1 left-0 h-0.5 bg-blue-500 dark:bg-blue-400"
                      />
                    </motion.span>
                  </Link>
                </motion.div>
              )
            )}
          </nav>

          <div className="flex gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/auth/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    Log In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Link href="/waitlist">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full overflow-hidden py-8">
          <div className="relative container mx-auto px-4 md:px-6">
            {/* Animated background elements */}
            <motion.div
              className="absolute -top-20 -left-20 z-0 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/30"
              animate={pulseAnimation}
            />
            <motion.div
              className="absolute top-40 -right-20 z-0 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-500/30"
              animate={{
                ...pulseAnimation,
                transition: { ...pulseAnimation.transition, delay: 1 },
              }}
            />

            <div className="relative z-10 grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <div className="space-y-2">
                  <AnimatedText
                    el="h1"
                    text={['Travel Your Way.', 'Every Day.']}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl leading-tight font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl dark:from-blue-400 dark:to-purple-400"
                    repeatDelay={10000}
                  />
                  <motion.p
                    className="max-w-[600px] text-slate-600 md:text-xl dark:text-slate-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Fast, reliable rides at your fingertips. Join our community
                    of riders and drivers in Bryan/College Station.
                  </motion.p>
                </div>
                <motion.div
                  className="relative flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <Link href="/auth/signup?role=user">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                      className="relative overflow-hidden"
                    >
                      {/* Shimmering border container */}
                      <div className="relative overflow-hidden rounded-lg p-0.5">
                        {/* Animated border effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-white"
                          style={{
                            backgroundSize: '200% 100%',
                          }}
                          animate={{
                            backgroundPosition: ['100% 100%', '0% 300%'],
                          }}
                          transition={{
                            ease: 'linear',
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />
                        <Button
                          size="lg"
                          className="relative z-10 w-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 transition-all hover:from-blue-600 hover:to-purple-600 min-[400px]:w-auto dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700"
                        >
                          <span className="relative z-10 flex items-center">
                            Book a Ride
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{
                                repeat: Number.POSITIVE_INFINITY,
                                duration: 5.5,
                              }}
                            >
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </motion.div>
                          </span>

                          {/* Shimmer effect overlay */}
                          <motion.div
                            className="absolute inset-0 h-full w-full"
                            style={{
                              background:
                                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                              backgroundSize: '200% 100%',
                            }}
                            animate={{
                              backgroundPosition: ['200% 0', '-200% 0'],
                            }}
                            transition={{
                              ease: 'linear',
                              duration: 5,
                              repeat: Infinity,
                            }}
                          />
                        </Button>
                      </div>
                    </motion.div>
                  </Link>
                  <Link href="/auth/signup?role=driver">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 min-[400px]:w-auto dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                      >
                        Become a Driver
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: 0.4,
                }}
              >
                <PrototypeCarousel />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <motion.section
          id="Mission"
          className="w-full bg-white py-12 md:py-24 lg:py-32 dark:bg-gray-900"
          ref={missionRef}
          initial="hidden"
          animate={missionInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <motion.h2
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent md:text-4xl/tight dark:from-blue-400 dark:to-purple-400"
                  variants={itemVariants}
                >
                  Our Mission
                </motion.h2>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto mt-8 grid max-w-3xl text-center"
              variants={itemVariants}
            >
              <motion.p
                className="mb-6 text-lg text-slate-600 dark:text-slate-300"
                variants={itemVariants}
              >
                At Flow, our mission is to make transportation seamless, safe,
                and accessible while empowering drivers with greater flexibility
                and earning potential. We strive to create a driver-first
                platform where our partners have the tools, support, and fair
                compensation they deserve.
              </motion.p>
              <motion.p
                className="text-lg text-slate-600 dark:text-slate-300"
                variants={itemVariants}
              >
                By prioritizing safety, community, and innovation, we connect
                riders with reliable drivers, ensuring affordability and trust
                in every ride. Flow isn’t just about getting from point A to B –
                It’s about building a transportation network that values and
                uplifts the people who make it possible.
              </motion.p>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="Features"
          className="relative w-full overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 py-12 md:py-24 lg:py-32 dark:from-blue-950 dark:to-purple-950"
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute -top-40 -right-40 z-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10"
            style={{ y: y1 }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 z-0 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10"
            style={{ y: y2 }}
          />

          <div className="relative z-10 container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-sm text-white dark:from-blue-600 dark:to-purple-600"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  variants={itemVariants}
                >
                  Features
                </motion.div>
                <motion.h2
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent md:text-4xl/tight dark:from-blue-400 dark:to-purple-400"
                  variants={itemVariants}
                >
                  What Makes Flow Different
                </motion.h2>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3"
              variants={staggerContainerVariants}
            >
              {[
                {
                  icon: (
                    <Shield className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                  ),
                  title: 'Transparent Pricing Model',
                  description:
                    'Via our transparent pricing model, drivers can better understand their earning potential.',
                },
                {
                  icon: (
                    <Clock className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                  ),
                  title: 'Subscription Driven',
                  description:
                    'With a subscription model, drivers have fixed costs, increasing their earnings potential.\n',
                },
                {
                  icon: (
                    <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  ),
                  title: 'Marketplace',
                  description:
                    'Through our marketplace, we return pricing power to the people, letting demand rule.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="grid gap-2 text-center"
                  variants={featureCardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <motion.div
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.h3
                    className={`text-xl font-bold ${
                      index === 1
                        ? 'text-purple-600 dark:text-purple-400'
                        : index === 2
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400'
                          : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p className="text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 flex justify-center"
              variants={fadeInUpVariants}
            >
              <Link href="/#Pricing">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700"
                  >
                    Checkout Pricing
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section
          id="Pricing"
          className="w-full bg-white py-12 md:py-24 lg:py-32 dark:bg-gray-900"
          ref={pricingRef}
          initial="hidden"
          animate={pricingInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <motion.div
                  className="inline-block rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-sm text-white dark:from-blue-600 dark:to-purple-600"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  variants={itemVariants}
                >
                  Pricing
                </motion.div>
                <motion.h2
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent md:text-4xl/tight dark:from-blue-400 dark:to-purple-400"
                  variants={itemVariants}
                >
                  Simple, Transparent Pricing
                </motion.h2>
                <motion.p
                  className="text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-300"
                  variants={itemVariants}
                >
                  Choose the plan that works best for you. Riders always ride
                  free.
                </motion.p>
              </div>
            </motion.div>

            {/* Riders Free Notice */}
            <motion.div
              className="mt-8 mb-12 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 dark:border-green-800 dark:from-green-950 dark:to-emerald-950"
              variants={fadeInUpVariants}
            >
              <div className="flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                  For Riders: Always Free
                </h3>
              </div>
              <p className="mt-2 text-center text-green-700 dark:text-green-300">
                No subscription fees, no hidden costs. Just pay for your rides
                at competitive rates.
              </p>
            </motion.div>

            {/* Driver Pricing Cards */}
            <motion.div
              className="mx-auto grid max-w-6xl gap-8 md:grid-cols-1 lg:grid-cols-3"
              variants={staggerContainerVariants}
            >
              {[
                {
                  name: 'Monthly',
                  price: '$10',
                  originalPrice: '$30',
                  period: 'per month',
                  icon: <Calendar className="h-8 w-8" />,
                  description: 'Perfect for regular drivers',
                  features: [
                    'No commissions on any rides',
                    'Keep 100% of your earnings',
                    'Flexible monthly billing',
                    'Cancel anytime',
                  ],
                  popular: false,
                  color: 'blue',
                  discount: true,
                },
                {
                  name: 'Yearly',
                  price: '$300',
                  period: 'per year',
                  icon: <DollarSign className="h-8 w-8" />,
                  description: 'Best value for committed drivers',
                  features: [
                    'Save $60 compared to monthly',
                    'No commissions on any rides',
                    'Keep 100% of your earnings',
                    'Annual billing discount',
                  ],
                  popular: true,
                  color: 'purple',
                },
                {
                  name: 'Commission',
                  price: '$40',
                  period: 'per month',
                  icon: <Percent className="h-8 w-8" />,
                  description: 'Commission-based pricing',
                  features: [
                    '20% commission until $40/month',
                    'No commission after $40/month',
                    'No monthly fees',
                    'Perfect for part-time drivers',
                  ],
                  popular: false,
                  color: 'green',
                },
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  className={`relative rounded-2xl border-2 p-8 transition-all duration-300 ${
                    plan.popular
                      ? 'scale-105 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:border-purple-600 dark:from-purple-950 dark:to-blue-950'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                  whileHover="hover"
                  custom={index}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 transform"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <span className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-1 text-sm font-semibold text-white">
                        Most Popular
                      </span>
                    </motion.div>
                  )}

                  <div className="mb-6 text-center">
                    <motion.div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                        plan.color === 'blue'
                          ? 'bg-gradient-to-r from-blue-400/20 to-blue-500/20 dark:from-blue-500/30 dark:to-blue-600/30'
                          : plan.color === 'purple'
                            ? 'bg-gradient-to-r from-purple-400/20 to-purple-500/20 dark:from-purple-500/30 dark:to-purple-600/30'
                            : 'bg-gradient-to-r from-green-400/20 to-green-500/20 dark:from-green-500/30 dark:to-green-600/30'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {plan.icon}
                    </motion.div>
                    <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                    <div className="mb-2">
                      {plan.discount ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-baseline gap-3">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                              {plan.price}
                            </span>
                            <span className="text-2xl text-slate-400 line-through dark:text-slate-500">
                              {plan.originalPrice}
                            </span>
                          </div>
                          <motion.span
                            className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            67% OFF
                          </motion.span>
                        </div>
                      ) : (
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                          {plan.price}
                        </span>
                      )}
                      <span className="mt-2 ml-1 block text-slate-600 dark:text-slate-300">
                        {plan.name === 'Commission' ? (
                          <>
                            per month<sup className="text-xs">*</sup>
                          </>
                        ) : (
                          plan.period
                        )}
                      </span>
                      {plan.discount && (
                        <span className="mt-1 block text-xs font-medium text-orange-600 dark:text-orange-400">
                          *Discount applies to first month only
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * featureIndex }}
                      >
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                        <span className="text-slate-600 dark:text-slate-300">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Link href="/auth/signup?role=driver">
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700'
                        }`}
                      >
                        Choose {plan.name}
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Commission Footnote */}
            <motion.div
              className="mt-8 text-center"
              variants={fadeInUpVariants}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                *Commission plan: 20% commission on rides until you reach $40 in
                monthly commission payments, then 0% commission for the rest of
                the month.
              </p>
            </motion.div>

            <motion.div
              className="mt-12 text-center"
              variants={fadeInUpVariants}
            >
              <p className="mb-4 text-slate-600 dark:text-slate-300">
                Questions about pricing? We&apos;re here to help.
              </p>
              <Link href="/#Contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    Contact Us
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* About Us Section */}
        <motion.section
          id="About"
          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 py-12 md:py-24 lg:py-32 dark:from-blue-950 dark:to-purple-950"
          ref={aboutRef}
          initial="hidden"
          animate={aboutInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <motion.h2
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent md:text-4xl/tight dark:from-blue-400 dark:to-purple-400"
                  variants={itemVariants}
                >
                  About Us
                </motion.h2>
                <motion.p
                  className="text-xl font-semibold text-blue-600 dark:text-blue-400"
                  variants={itemVariants}
                >
                  Travel your way. Every Day.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto mt-8 grid max-w-3xl text-center"
              variants={itemVariants}
            >
              {[
                "At Flow, we believe in seamless, efficient, and reliable transportation. Founded with the vision of redefining ride sharing in Bryan/College Station, we're committed to providing a safe and affordable way to get around town.",
                "Our platform connects riders with independent drivers who meet strict safety and reliability standards. Whether you're heading to class, work, or a night out, Flow ensures you get there with ease.",
                "Driven by innovation and a passion for community, we're here to make every ride simple, stress-free, and accessible. Welcome to a new era of transportation- welcome to Flow.",
              ].map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="mb-6 text-lg text-slate-600 dark:text-slate-300"
                  variants={fadeInUpVariants}
                  custom={index}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            {/* Founders Section */}
            <motion.div className="mt-16" variants={containerVariants}>
              <motion.h3
                className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-2xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400"
                variants={itemVariants}
              >
                Our Founders
              </motion.h3>

              <motion.div
                className="mx-auto grid max-w-6xl gap-8 md:grid-cols-1 lg:grid-cols-2"
                variants={staggerContainerVariants}
              >
                {[
                  {
                    name: 'Moulik Mishra',
                    link: 'https://www.linkedin.com/in/moulik-mishra-014b801a6/',
                    title: 'CEO',
                    image: '/Moulik.jpg',
                  },
                  {
                    name: 'Daniel Kim',
                    title: 'CMO',
                    link: 'https://www.linkedin.com/in/danielhjkim/',
                    image: '/Daniel.jpeg',
                  },
                  {
                    name: 'Ritin Mereddy',
                    title: 'CTO',
                    link: 'https://www.linkedin.com/in/ritinm/',
                    image: '/Ritin.jpg',
                  },
                  {
                    name: 'Justin Le',
                    link: 'https://www.linkedin.com/in/justindtle/',
                    title: 'Software Developer',
                    image: '/Justin.jpg',
                  },
                ].map((founder, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center text-center"
                    variants={founderCardVariants}
                    whileHover="hover"
                    custom={index}
                  >
                    <motion.div
                      className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 dark:from-blue-500/40 dark:to-purple-500/40"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <div className="h-32 w-32 overflow-hidden rounded-full">
                        <Link href={founder.link} legacyBehavior>
                          <a target="_blank" rel="noopener noreferrer">
                            <Image
                              src={`${founder.image}`}
                              alt={`${founder.name}`}
                              width={256}
                              height={256}
                              className="h-full w-full object-cover"
                              priority={index < 2} // Prioritize loading the first two images
                            />
                          </a>
                        </Link>
                      </div>
                    </motion.div>
                    <motion.h4 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                      {founder.name.split(' ')[0]}
                    </motion.h4>
                    <motion.p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {founder.title}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-12 flex justify-center"
              variants={fadeInUpVariants}
            >
              <Link href="/auth/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <ShinyButton className="border-1 border-black dark:border-white">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text px-4 text-lg text-transparent hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700">
                      Are you ready to go with Flow?
                    </span>
                  </ShinyButton>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          id="FAQ"
          className="w-full bg-white py-12 md:py-24 lg:py-32 dark:bg-gray-900"
          ref={faqRef}
          initial="hidden"
          animate={faqInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <motion.h2
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent md:text-4xl/tight dark:from-blue-400 dark:to-purple-400"
                  variants={itemVariants}
                >
                  Frequently Asked Questions
                </motion.h2>
                <motion.p
                  className="text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-300"
                  variants={itemVariants}
                >
                  Find answers to common questions about Flow
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="mx-auto mt-8 grid max-w-3xl"
              variants={fadeInUpVariants}
            >
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: 'How do I book a ride?',
                    answer:
                      'To book a ride with Flow, simply download our app, create an account, enter your pickup location and destination, and select a driver. You can track your ride in real-time and pay securely through the app.',
                    color:
                      'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                  },
                  {
                    question:
                      'What happens if I lose an item in a Flow vehicle?',
                    answer:
                      "If you've lost an item in a Flow vehicle, contact us immediately through the app or website. We'll connect you with your driver to arrange for the return of your belongings. Our drivers are instructed to check their vehicles after each ride and report any found items.",
                    color:
                      'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                  },
                  {
                    question: 'How do I become a driver?',
                    answer:
                      "To become a Flow driver, sign up through our app or website, complete the background check, provide required documentation (driver's license, insurance, vehicle registration), and complete our brief orientation. Once approved, you can start accepting rides and earning money on your own schedule.",
                    color:
                      'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                  },
                  {
                    question:
                      'What is the earnings split between a driver and Flow?',
                    answer:
                      'At Flow, we believe in fair compensation. Drivers keep a significantly higher percentage of the fare compared to traditional ride share services. We operate on a subscription model where drivers pay a fixed weekly or monthly fee rather than a percentage of each ride, allowing them to maximize their earnings potential.',
                    color:
                      'text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300',
                    borderColor: 'border-blue-200 dark:border-blue-800',
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <AccordionItem
                      value={`item-${index + 1}`}
                      className={`{faq.borderColor}`}
                    >
                      <AccordionTrigger
                        className={`${faq.color} text-lg font-medium md:text-xl`}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-600 md:text-lg dark:text-slate-300">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          id="Contact"
          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 py-12 md:py-24 lg:py-32 dark:from-blue-950 dark:to-purple-950"
          ref={contactRef}
          initial="hidden"
          animate={contactInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <div className="mx-auto px-4 pr-6 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              variants={itemVariants}
            >
              <div className="space-y-2">
                <motion.h2
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tighter text-transparent md:text-4xl/tight dark:from-blue-400 dark:to-purple-400"
                  variants={itemVariants}
                >
                  Contact Us
                </motion.h2>
                <motion.p
                  className="text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-300"
                  variants={itemVariants}
                >
                  Have questions or want to learn more? Get in touch with our
                  team.
                </motion.p>
              </div>
            </motion.div>

            <ContactForm />
          </div>
        </motion.section>
      </main>

      <motion.footer
        className="justify-around border-t border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 py-6 md:py-0 dark:border-gray-800 dark:from-blue-950 dark:to-purple-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row md:px-6">
          <motion.div
            className="flex items-center gap-2 text-lg font-semibold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
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
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Flow
            </span>
          </motion.div>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {['Terms of Service', 'Privacy Policy', 'Contact Us'].map(
              (item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {item === 'Contact Us' ? (
                    <Link
                      href="/#Contact"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {item}
                    </Link>
                  ) : item === 'Privacy Policy' ? (
                    <Link
                      href="/privacy"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {item}
                    </Link>
                  ) : (
                    <button
                      onClick={() => setOpenModal('terms')}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {item}
                    </button>
                  )}
                </motion.div>
              )
            )}
          </motion.div>

          <LegalModal
            openModal={openModal}
            onCloseAction={() => setOpenModal(null)}
          />

          <motion.p
            className="text-sm text-slate-500 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            &copy; {new Date().getFullYear()} Flow. All rights reserved.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  )
}
