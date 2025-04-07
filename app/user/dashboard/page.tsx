"use client"

import Link from "next/link"
import { Car, Clock, CreditCard, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/auth"

export default function UserDashboard() {
  const { user } = useUser()

  // Mock data for the dashboard
  const upcomingRides = [
    {
      id: "RID-1234",
      driver: "Michael Smith",
      from: "Home",
      to: "Office",
      time: "Today, 9:00 AM",
      status: "Scheduled",
    },
    {
      id: "RID-1235",
      driver: "Sarah Johnson",
      from: "Office",
      to: "Home",
      time: "Today, 6:00 PM",
      status: "Scheduled",
    },
  ]

  const recentRides = [
    {
      id: "RID-1230",
      driver: "Robert Davis",
      from: "Home",
      to: "Airport",
      time: "Yesterday, 10:30 AM",
      amount: "$24.50",
      rating: 5,
    },
    {
      id: "RID-1229",
      driver: "Jennifer Wilson",
      from: "Mall",
      to: "Home",
      time: "Mar 25, 3:45 PM",
      amount: "$12.75",
      rating: 4,
    },
    {
      id: "RID-1228",
      driver: "David Brown",
      from: "Restaurant",
      to: "Home",
      time: "Mar 23, 9:15 PM",
      amount: "$18.20",
      rating: 5,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName || "Rider"}!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your rides and activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distance Traveled</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142 mi</div>
            <p className="text-xs text-muted-foreground">+28 mi from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 hrs</div>
            <p className="text-xs text-muted-foreground">Compared to public transit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$348.50</div>
            <p className="text-xs text-muted-foreground">+$42.25 from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Rides</CardTitle>
            <CardDescription>Your scheduled rides for today</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingRides.length > 0 ? (
              <div className="space-y-4">
                {upcomingRides.map((ride) => (
                  <div key={ride.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{ride.time}</div>
                      <div className="text-sm text-muted-foreground">#{ride.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        {ride.from} → {ride.to}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">Driver: {ride.driver}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-primary">{ride.status}</div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[100px] flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No upcoming rides</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/user/rides" className="w-full">
              <Button className="w-full">Book a Ride</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Rides</CardTitle>
            <CardDescription>Your ride history</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRides.length > 0 ? (
              <div className="space-y-4">
                {recentRides.map((ride) => (
                  <div key={ride.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{ride.time}</div>
                      <div className="text-sm text-muted-foreground">#{ride.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        {ride.from} → {ride.to}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">Driver: {ride.driver}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-medium">{ride.amount}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < ride.rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[100px] flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-sm text-muted-foreground">No ride history</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/user/rides" className="w-full">
              <Button variant="outline" className="w-full">
                View All Rides
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

