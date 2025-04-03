import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Car, Clock, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Car className="h-6 w-6" />
            <span>Flow</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/#mission" className="text-sm font-medium hover:underline underline-offset-4">
              Our Mission
            </Link>
            <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="/#about" className="text-sm font-medium hover:underline underline-offset-4">
              About Us
            </Link>
            <Link href="/#faq" className="text-sm font-medium hover:underline underline-offset-4">
              FAQ
            </Link>
            <Link href="/#contact" className="text-sm font-medium hover:underline underline-offset-4">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Travel your way. Every Day.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Fast, reliable rides at your fingertips. Join our community of riders and drivers in Bryan/College
                    Station.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup?role=user">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Book a Ride
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/signup?role=driver">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Become a Driver
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Hero Image"
                  className="rounded-xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Mission</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl mt-8 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                At Flow, our mission is to make transportation seamless, safe, and accessible while empowering drivers
                with greater flexibility and earning potential. We strive to create a driver-first platform where our
                partners have the tools, support, and fair compensation they deserve.
              </p>
              <p className="text-lg text-muted-foreground">
                By prioritizing safety, community, and innovation, we connect riders with reliable drivers, ensuring
                affordability and trust in every ride. Flow isn&apos;t just about getting from point A to B - It&apos;s about
                building a transportation network that values and uplifts the people who make it possible.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Makes Flow Different</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="grid gap-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Transparent Pricing Model</h3>
                <p className="text-muted-foreground">
                  Via our transparent pricing model, drivers can better understand their earning potential.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Subscription Driven</h3>
                <p className="text-muted-foreground">
                  With a subscription model, drivers have fixed costs, increasing earnings potential.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Marketplace</h3>
                <p className="text-muted-foreground">
                  Through our marketplace, we return pricing power to the people, letting demand rule.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="#contact">
                <Button size="lg">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">About Us</h2>
                <p className="text-xl font-semibold text-primary">Travel your way. Every Day.</p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl mt-8 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                At Flow, we believe in seamless, efficient, and reliable transportation. Founded with the vision of
                redefining ridesharing in Bryan/College Station, we&apos;re committed to providing a safe and affordable way
                to get around town.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform connects riders with independent drivers who meet strict safety and reliability standards.
                Whether you&apos;re heading to class, work, or a night out, Flow ensures you get there with ease.
              </p>
              <p className="text-lg text-muted-foreground">
                Driven by innovation and a passion for community, we&apos;re here to make every ride simple, stress-free, and
                accessible. Welcome to a new era of transportation- welcome to Flow.
              </p>
            </div>

            {/* Founders Section */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">Our Founders</h3>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {/* Founder 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-muted-foreground/20 mb-4 overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      width={128}
                      height={128}
                      alt="Founder 1"
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-bold">Founder Name</h4>
                  <p className="text-sm text-muted-foreground mt-1">Co-Founder & CEO</p>
                  <p className="mt-2 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
                  </p>
                </div>

                {/* Founder 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-muted-foreground/20 mb-4 overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      width={128}
                      height={128}
                      alt="Founder 2"
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-bold">Founder Name</h4>
                  <p className="text-sm text-muted-foreground mt-1">Co-Founder & CTO</p>
                  <p className="mt-2 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
                  </p>
                </div>

                {/* Founder 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-muted-foreground/20 mb-4 overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=128&width=128"
                      width={128}
                      height={128}
                      alt="Founder 3"
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-bold">Founder Name</h4>
                  <p className="text-sm text-muted-foreground mt-1">Co-Founder & COO</p>
                  <p className="mt-2 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="#contact">
                <Button size="lg" className="text-lg px-8">
                  Are you ready to go with Flow?
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about Flow
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-3xl mt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I book a ride?</AccordionTrigger>
                  <AccordionContent>
                    To book a ride with Flow, simply download our app, create an account, enter your pickup location and
                    destination, and select a driver. You can track your ride in real-time and pay securely through the
                    app.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What happens if I lose an item in a Flow vehicle?</AccordionTrigger>
                  <AccordionContent>
                    If you&apos;ve lost an item in a Flow vehicle, contact us immediately through the app or website. We&apos;ll
                    connect you with your driver to arrange for the return of your belongings. Our drivers are
                    instructed to check their vehicles after each ride and report any found items.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I become a driver?</AccordionTrigger>
                  <AccordionContent>
                    To become a Flow driver, sign up through our app or website, complete the background check, provide
                    required documentation (driver&apos;s license, insurance, vehicle registration), and complete our brief
                    orientation. Once approved, you can start accepting rides and earning money on your own schedule.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>What is the earnings split between a driver and Flow?</AccordionTrigger>
                  <AccordionContent>
                    At Flow, we believe in fair compensation. Drivers keep a significantly higher percentage of the fare
                    compared to traditional rideshare services. We operate on a subscription model where drivers pay a
                    fixed weekly or monthly fee rather than a percentage of each ride, allowing them to maximize their
                    earnings potential.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Contact Us</h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Have questions or want to learn more? Get in touch with our team.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-lg mt-8 w-full">
              <form className="space-y-4 w-full" action="https://formspree.io/f/Team@RoamwithFlow.com" method="POST">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="Your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="Your phone number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Contact</Label>
                  <Select name="reason" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="invest">To Invest</SelectItem>
                      <SelectItem value="ride">To Ride</SelectItem>
                      <SelectItem value="drive">To Drive</SelectItem>
                      <SelectItem value="interview">To Interview</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Comments</Label>
                  <Textarea id="message" name="message" placeholder="Your message" className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6 mx-auto">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Car className="h-6 w-6" />
            <span>Flow</span>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#contact" className="text-sm hover:underline underline-offset-4">
              Contact Us
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}