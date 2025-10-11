"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Shield, Eye, Lock, Users, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"

export default function PrivacyPolicyPage() {
  const contentRef = useRef(null)
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 })

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
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  }

  const fadeInUpVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.6 },
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      {/* Header */}
      <header className="border-b border-blue-950 sticky top-0 z-40 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Image src="/logo.png" width={30} height={30} alt="Flow Logo" priority />
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

          <div className="flex gap-4">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <Link href="/auth/login">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    Log In
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
              <Link href="/auth/signup">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700"
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 mx-auto max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/">
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div
            ref={contentRef}
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.div className="flex items-center justify-center mb-6" variants={itemVariants}>
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 mb-4"
              variants={itemVariants}
            >
              Privacy Policy
            </motion.h1>
            
            <motion.p
              className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </motion.p>
            
            <motion.p
              className="text-sm text-slate-500 dark:text-slate-400 mt-4"
              variants={itemVariants}
            >
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-12"
          >
            {/* Overview */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Overview</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Flow Enterprises, Inc. and their respective affiliates and subsidiaries, and ours and their directors, officers, and employees, (collectively, &ldquo;Flow,&rdquo; the &ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;) operate the Flow rideshare app, the website located at Roamwithflow.com and other related websites, subpages, subdomains, mobile applications, content, offerings, information, tools, software and services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    We respect your privacy and are committed to protecting it through our compliance with this Privacy Policy. Unless defined herein, capitalized terms used in this Privacy Policy have the meanings given to such terms in our Terms of Service. This Privacy Policy governs the manner in which the Company collects, uses, maintains and discloses information collected from users of our Site and through the Services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    This Privacy Policy applies to the Site, the Services, and all products and services offered by the Company. Please read this Privacy Policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your only choice is not to use our Site or the Services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    By accessing or using our Site, you agree to this Privacy Policy. This Privacy Policy may change from time to time (see &ldquo;Changes to This Privacy Policy&rdquo; below). Your continued use of the Site or the Services after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Personal Information */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Personal Information</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We collect several types of information from and about users of our Site and the Services, including information by which you may be personally identified, such as name, email address, bank account, Stripe or PayPal account or other payment account, or any other identifier by which you may be contacted online or offline (&ldquo;personal information&rdquo;).
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    We collect personal information from users in a variety of ways, including, but not limited to, when users visit our Site, register as a user on the Site, and in connection with other activities, services, features or resources we make available on our Site, including through the Services.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    If a user wishes to register on our Site, the user will be asked to provide their name, email address, phone number, and, in certain cases, certain other information, including payment account information. We will collect personal information from users only if they voluntarily submit such information to us. Users can always refuse to supply any personal information.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    However, if a user elects not to supply certain personal information during the process of registering with the Site, such election not to provide such personal information may preclude a user from successfully registering as a user, which would preclude the user from using many of the Services that are reserved for and made available only to certain registered users.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Non-Personal Information */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Non-Personal Information</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We may collect information from you or from your use of or interaction with the Site or the Services that is about you, but that individually does not identify you (&ldquo;non-personal information&rdquo;). Non-personal information may include your browser name, your computer type or other equipment you use to access our Site, other technical information about your means of connection to our Site, such as your operating system and the Internet service providers utilized, and other similar usage information.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Information We Collect */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                    <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Information We Collect That You Provide To Us</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    The information we collect on or through our Site that is based on information you provide to us may include the following:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                    <li>Information, including personal information, that you provide by filling out forms on our Site, including information provided at the time of registering.</li>
                    <li>Information you post or submit to the Site contained in or relating to any messages, notes or comments.</li>
                    <li>Information contained in any correspondence between you and any other users on the Site.</li>
                    <li>Records and copies of all your correspondence with us (including email addresses) if you contact us.</li>
                    <li>Information relating to any search queries you make on the Site.</li>
                    <li>Information regarding payment methods.</li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    When you add a credit card or payment method to your Flow account, a third party that handles payments for us will receive your card information. To keep your financial data secure, we do not store full credit card information on our servers.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    If you decide to join our driver community, in addition to the basic registration information, we may ask you for your date of birth, physical address, Social Security number, driver&apos;s license information, vehicle information, car insurance information, and in some jurisdictions, we may collect additional business license or permitting information. We share this information with our partners who help us by running background checks on Drivers to help protect the Flow community.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Automatic Data Collection */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 mr-4">
                    <Eye className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Information We Collect Through Automatic Data Collection Technologies</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    As you navigate through and interact with our Site and the Services, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions and patterns, including the following:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                    <li>Details of your visits to our Site, including traffic data, location data, logs and other communication data, and the dates, resources and Services that you access and use on the Site.</li>
                    <li>Information about your computer and internet connection, including your IP address, operating system and browser type, phone carrier and manufacturer, application installations, device identifiers, mobile advertising identifiers, push notification tokens, and, if you register with your Facebook account, your Facebook identifier.</li>
                    <li>We may collect mobile sensor data from Drivers&apos; devices (such as speed, direction, height, acceleration or deceleration) to improve location accuracy and analyze usage patterns.</li>
                    <li>Call and Text Information: We may work with a third-party partner to facilitate phone calls and text messages between Riders and Drivers who have been connected for a ride.</li>
                    <li>Third Party Services: If you choose to register or otherwise link your account with a third party&apos;s service (such as Facebook), we may receive the same type of information we collect from you (described above) directly from those services.</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Web Browser Cookies */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Web Browser Cookies</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Our Site uses &ldquo;cookies&rdquo; to enhance user experience. A user&apos;s web browser places cookies on the user&apos;s hard drive for record-keeping purposes and sometimes to track information about the user. A user may choose to set its web browser to refuse cookies, or to alert the user when cookies are being sent. If a user does so, note that some parts of the Site and/or the Services may not function properly.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our Site. We may use web beacons on our Site or in our emails that permit the Company, for example, to count users who have opened an email and for other related website statistics.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* How We Use Information */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">How We Use Collected Information</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    The Company may collect and use users&apos; personal information for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-300">
                    <li><strong>To run and operate our Site and the Services:</strong> We may need your information to display content on the Site correctly and to connect you with other members. Riders and Drivers that have been matched for a ride may be able to see basic information about each other, such as names, photo, ratings, and any information they have added to their Profiles.</li>
                    <li><strong>To improve customer service:</strong> Information you provide helps us respond to your customer service requests and support user needs more efficiently.</li>
                    <li><strong>To personalize user experience:</strong> We may use information in the aggregate to understand how our users use the services and resources provided on our Site.</li>
                    <li><strong>To improve our Site and the Services:</strong> We may use feedback you provide to improve our products and services.</li>
                    <li><strong>To process payments:</strong> We use third-party payment applications to process payments. When you provide us with your payment or billing information, we do not share this information with outside parties except to the extent necessary to provide such payment services.</li>
                    <li><strong>To run a promotion, contest, survey or other Site feature:</strong> We may send users information they agreed to receive about topics we think will be of interest to them.</li>
                    <li><strong>To send periodic emails:</strong> We may use a user&apos;s provided email address to send users information and updates. It may also be used to respond to their inquiries, questions, and/or other requests.</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* How We Protect Information */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                    <Lock className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">How We Protect Your Information</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    We adopt customary data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site. Sensitive and private data exchange between and among the Site and its users occurs over an SSL secured communication channel and is encrypted and protected with digital signatures.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Sharing Information */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Sharing Your Personal Information</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    Except as provided below or elsewhere in this Privacy Policy, we do not sell, trade or rent any personal information of users to others. We may share generic aggregated demographic information not linked to any personal information regarding visitors and users with our business partners and trusted affiliates for the purposes outlined above.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    We may use third-party service providers to help us operate our business, the Site and the Services, or administer activities on our behalf, such as sending out newsletters, emails or surveys, or to develop or improve any of the Services. We may share your information with these third parties for those limited purposes provided that you have given us your permission.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    Additionally, we may disclose personal information that we collect or that you provide as described in this Privacy Policy:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300 mt-4">
                    <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution or other sale or transfer of some or all of the Company&apos;s assets in which certain personal information of users is among the assets transferred.</li>
                    <li>To comply with any court order, law or legal process, including to respond to any government or regulatory request.</li>
                    <li>To enforce or apply our Terms of Service or other agreements.</li>
                    <li>If we believe disclosure is necessary or appropriate to protect the rights, property or safety of the Company, our customers or others.</li>
                  </ul>
                </div>
              </div>
            </motion.section>

            {/* Image Collection */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Image Collection and Usage</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    Flow Enterprises, Inc. prioritizes the safety and security of all individuals who utilize our rideshare platform. To uphold these values and ensure a trusted environment, we collect and utilize images in the following ways:
                  </p>
                  <ul className="list-disc pl-6 space-y-3 text-slate-600 dark:text-slate-300">
                    <li><strong>Verification and Identification:</strong> Images, including photographs uploaded by Riders and Drivers to their profiles, are utilized to verify the identity of individuals and to facilitate the accurate matching of Riders and Drivers. This measure is critical in creating a reliable and secure platform where users can confidently interact with one another.</li>
                    <li><strong>Safety Measures:</strong> Images captured before, during, or after rides are used as a safety measure to investigate and resolve any disputes or incidents that may occur. These images serve as an additional layer of security and accountability on our platform.</li>
                    <li><strong>Quality Assurance:</strong> We use images to monitor and ensure the quality of the rideshare experience provided on our platform. This includes, but is not limited to, verifying the condition and cleanliness of vehicles used on the platform and ensuring compliance with our community standards.</li>
                  </ul>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    The collection, processing, and utilization of images are conducted with the utmost respect for individual privacy and in accordance with applicable laws and regulations. Users have the option to provide or withhold consent for image collection and usage as part of their account settings, though certain functionalities and features of the platform may be contingent upon such consent.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Children's Privacy */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 mr-4">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">Compliance with Children&apos;s Online Privacy Protection Act</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Protecting the privacy of the very young is especially important. For that reason, we never collect or maintain information on or from our Site or from the Services from those we actually know are under 13 years of age, and no part of our Site or the Services are structured or intended to attract anyone under 13 years of age.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    No one under age 13 may provide or submit any information to or on the Site or through the Services. If you are under 13, do not use or provide any information on our Site or through the Services, and do not register on the Site, use any of the interactive or public comment features of the Site, or provide any information about yourself to us or to any other user, including your name, address, telephone number, email address, or any screen name or user name you may use.
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
                    If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Changes to Policy */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 mr-4">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Changes to This Privacy Policy</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    The Company may, in its sole discretion, modify or update this Privacy Policy at any time. We encourage all users to frequently check this page for any changes and to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this Privacy Policy periodically for any modifications or updates.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Acceptance */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">Your Acceptance of These Terms</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    By using our Site, you signify your acceptance of this Privacy Policy, which is incorporated into and a part of our Terms of Service. If you do not agree to this Privacy Policy, please do not use our Site or the Services. Your continued use of the Site or the Services following the posting of any changes to this Privacy Policy will be deemed your acceptance of those changes.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Contact */}
            <motion.section variants={fadeInUpVariants}>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-6">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Contact Us</h2>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    If you have any questions about this Privacy Policy, the practices of our Site, or your dealings with our Site, please contact us by email at{" "}
                    <a href="mailto:team@roamwithflow.com" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      team@roamwithflow.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="border-t border-blue-100 py-6 md:py-0 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6 mx-auto">
          <motion.div className="flex items-center gap-2 text-lg font-semibold" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <Image src="/logo.png" width={30} height={30} alt="Flow Logo" />
            </motion.div>
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Flow
            </span>
          </motion.div>
          
          <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              Home
            </Link>
            <Link href="/privacy" className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              Privacy Policy
            </Link>
            <a href="mailto:team@roamwithflow.com" className="text-sm text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              Contact Us
            </a>
          </motion.div>

          <motion.p className="text-sm text-slate-500 dark:text-slate-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}>
            &copy; {new Date().getFullYear()} Flow. All rights reserved.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  )
}
