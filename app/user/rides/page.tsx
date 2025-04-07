"use client"

import { useState } from "react"
import { Car, Clock, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function UserRides() {
  const { toast } = useToast()
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [rideType, setRideType] = useState("standard")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for available drivers
  const availableDrivers = [
    {
      id: "DRV-1234",
      name: "Michael Smith",
      vehicle: "Toyota Camry",
      plate: "ABC-1234",
      rating: 4.9,
      arrivalTime: "5 min",
      price: "$12.50",
    },
    {
      id: "DRV-1235",
      name: "Sarah Johnson",
      vehicle: "Honda Civic",
      plate: "XYZ-5678",
      rating: 4.8,
      arrivalTime: "8 min",
      price: "$11.75",
    },
    {
      id: "DRV-1236",
      name: "David Wilson",
      vehicle: "Ford Fusion",
      plate: "DEF-9012",
      rating: 4.7,
      arrivalTime: "12 min",
      price: "$10.25",
    },
  ]

  const handleBookRide = (driverId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Ride Booked",
        description: "Your ride has been successfully booked!",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Book a Ride</h1>
        <p className="text-muted-foreground">Enter your pickup and destination to find available drivers.</p>
      </div>

      <Tabs defaultValue="ride" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ride">Ride</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="ride" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>Enter your pickup location and destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickup">Pickup Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="pickup"
                    placeholder="Enter pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <MapPin className="h-4 w-4" />
                    <span className="sr-only">Use current location</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ride Type</Label>
                <RadioGroup value={rideType} onValueChange={setRideType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="economy" id="economy" />
                    <Label htmlFor="economy" className="font-normal">
                      Economy - Affordable rides for everyday use
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="font-normal">
                      Standard - Comfortable rides with more space
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="font-normal">
                      Premium - Luxury vehicles for special occasions
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={!pickup || !destination}>
                <Search className="mr-2 h-4 w-4" />
                Find Drivers
              </Button>
            </CardFooter>
          </Card>

          {pickup && destination && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Available Drivers</h2>
              {availableDrivers.map((driver) => (
                <Card key={driver.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm font-medium">{driver.price}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {driver.vehicle} ({driver.plate})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">Arrives in {driver.arrivalTime}</div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className={`h-4 w-4 ${
                                i < Math.floor(driver.rating) ? "text-yellow-500" : "text-gray-300"
                              }`}
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                          <span className="ml-1 text-sm">{driver.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <Button onClick={() => handleBookRide(driver.id)} disabled={isLoading}>
                          {isLoading ? "Booking..." : "Book Now"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule a Ride</CardTitle>
              <CardDescription>Plan your ride in advance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">Schedule ride feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ride History</CardTitle>
              <CardDescription>View your past rides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">Ride history feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

