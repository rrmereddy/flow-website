"use client"

import { useState } from "react"
import { Car, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function DriverRides() {
  const { toast } = useToast()
  const [isAvailable, setIsAvailable] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for ride requests
  const rideRequests = [
    {
      id: "RID-1234",
      user: "John Smith",
      from: "Downtown",
      to: "Airport",
      distance: "8.2 miles",
      estimatedTime: "22 min",
      price: "$24.50",
    },
    {
      id: "RID-1235",
      user: "Emily Johnson",
      from: "Mall",
      to: "Residential Area",
      distance: "5.7 miles",
      estimatedTime: "15 min",
      price: "$18.75",
    },
    {
      id: "RID-1236",
      user: "Michael Brown",
      from: "Hotel",
      to: "Convention Center",
      distance: "3.4 miles",
      estimatedTime: "10 min",
      price: "$12.25",
    },
  ]

  // Mock data for upcoming rides
  const upcomingRides = [
    {
      id: "RID-1237",
      user: "Sarah Davis",
      from: "Office Park",
      to: "Restaurant District",
      time: "Today, 5:30 PM",
      price: "$22.00",
    },
    {
      id: "RID-1238",
      user: "David Wilson",
      from: "Airport",
      to: "Downtown",
      time: "Tomorrow, 10:15 AM",
      price: "$28.50",
    },
  ]

  const handleAcceptRide = (rideId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Ride Accepted",
        description: "You have successfully accepted the ride: " + rideId,
      })
    }, 1500)
  }

  const handleDeclineRide = (rideId: string) => {
    toast({
      title: "Ride Declined",
      description: "You have declined the ride request: " + rideId,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Manage Rides</h1>
        <p className="text-muted-foreground">View and accept ride requests, manage your upcoming rides.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Driver Status</CardTitle>
            <div className="flex items-center space-x-2">
              <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
              <label
                htmlFor="availability"
                className={`text-sm font-medium ${isAvailable ? "text-green-500" : "text-muted-foreground"}`}
              >
                {isAvailable ? "Available" : "Unavailable"}
              </label>
            </div>
          </div>
          <CardDescription>Toggle your availability to receive ride requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Current Location</div>
              <div className="text-sm text-muted-foreground">Downtown Area</div>
            </div>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Update Location
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Ride Requests</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
          <TabsTrigger value="history">Ride History</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {isAvailable ? (
            rideRequests.length > 0 ? (
              <div className="space-y-4">
                {rideRequests.map((ride) => (
                  <Card key={ride.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Ride Request #{ride.id}</div>
                          <div className="text-lg font-bold">{ride.price}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">Rider: {ride.user}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {ride.from} → {ride.to}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">Distance: {ride.distance}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">Est. Time: {ride.estimatedTime}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => handleAcceptRide(ride.id)} disabled={isLoading}>
                            {isLoading ? "Accepting..." : "Accept"}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDeclineRide(ride.id)}
                            disabled={isLoading}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Car className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No Ride Requests</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      There are currently no ride requests in your area. Check back soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <Car className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">You&apos;re Currently Unavailable</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Toggle your status to &quot;Available&quot; to start receiving ride requests.
                  </p>
                  <Button className="mt-4" onClick={() => setIsAvailable(true)}>
                    Go Online
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingRides.length > 0 ? (
            <div className="space-y-4">
              {upcomingRides.map((ride) => (
                <Card key={ride.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{ride.time}</div>
                        <div className="text-lg font-bold">{ride.price}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">Rider: {ride.user}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {ride.from} → {ride.to}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">Navigate</Button>
                        <Button variant="outline" className="flex-1">
                          Contact Rider
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <Car className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No Upcoming Rides</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don&apos;t have any upcoming rides scheduled. Accept ride requests to see them here.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
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

