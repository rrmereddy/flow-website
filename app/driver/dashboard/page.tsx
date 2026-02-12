'use client'

import Link from 'next/link'
import {
  Car,
  Clock,
  CreditCard,
  MapPin,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUser } from '@/lib/auth'

export default function DriverDashboard() {
  const { user } = useUser()

  // Mock data for the dashboard
  const upcomingRides = [
    {
      id: 'RID-1234',
      user: 'John Smith',
      from: 'Downtown',
      to: 'Airport',
      time: 'Today, 10:30 AM',
      amount: '$24.50',
      status: 'Accepted',
    },
    {
      id: 'RID-1235',
      user: 'Emily Johnson',
      from: 'Mall',
      to: 'Residential Area',
      time: 'Today, 2:15 PM',
      amount: '$18.75',
      status: 'Accepted',
    },
  ]

  const recentRides = [
    {
      id: 'RID-1230',
      user: 'Michael Brown',
      from: 'Hotel',
      to: 'Convention Center',
      time: 'Yesterday, 9:45 AM',
      amount: '$15.25',
      rating: 5,
    },
    {
      id: 'RID-1229',
      user: 'Sarah Davis',
      from: 'Office Park',
      to: 'Restaurant District',
      time: 'Mar 25, 5:30 PM',
      amount: '$22.00',
      rating: 4,
    },
    {
      id: 'RID-1228',
      user: 'David Wilson',
      from: 'Airport',
      to: 'Downtown',
      time: 'Mar 23, 8:15 PM',
      amount: '$28.50',
      rating: 5,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.firstName || 'Driver'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your rides and earnings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Earnings
            </CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$85.25</div>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Rides
            </CardTitle>
            <Car className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-muted-foreground text-xs">+8 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.5 hrs</div>
            <p className="text-muted-foreground text-xs">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.92</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= 5 ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
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
                  <div
                    key={ride.id}
                    className="flex flex-col space-y-2 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{ride.time}</div>
                      <div className="text-muted-foreground text-sm">
                        #{ride.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <div className="text-sm">
                        {ride.from} → {ride.to}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <div className="text-sm">Rider: {ride.user}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-primary text-sm font-medium">
                          {ride.status}
                        </div>
                        <div className="text-sm font-medium">{ride.amount}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        Navigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[100px] flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground text-sm">
                  No upcoming rides
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/driver/rides" className="w-full">
              <Button className="w-full">Find Rides</Button>
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
                  <div
                    key={ride.id}
                    className="flex flex-col space-y-2 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{ride.time}</div>
                      <div className="text-muted-foreground text-sm">
                        #{ride.id}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <div className="text-sm">
                        {ride.from} → {ride.to}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <div className="text-sm">Rider: {ride.user}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="text-sm font-medium">{ride.amount}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < ride.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[100px] flex-col items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground text-sm">No ride history</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/driver/rides" className="w-full">
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
