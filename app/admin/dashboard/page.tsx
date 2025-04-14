"use client"

import { useState } from "react"
import { BarChart, Calendar, Car, CreditCard, DollarSign, MapPin, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      change: "+12%",
      icon: Users,
    },
    {
      title: "Total Drivers",
      value: "1,234",
      change: "+8%",
      icon: Car,
    },
    {
      title: "Total Rides",
      value: "45,678",
      change: "+23%",
      icon: MapPin,
    },
    {
      title: "Revenue",
      value: "$123,456",
      change: "+18%",
      icon: DollarSign,
    },
  ]

  const recentRides = [
    {
      id: "RID-1234",
      user: "John Doe",
      driver: "Michael Smith",
      from: "Downtown",
      to: "Airport",
      amount: "$24.50",
      status: "Completed",
      date: "2023-03-28 14:30",
    },
    {
      id: "RID-1235",
      user: "Jane Smith",
      driver: "Robert Johnson",
      from: "Mall",
      to: "Residential Area",
      amount: "$12.75",
      status: "Completed",
      date: "2023-03-28 15:45",
    },
    {
      id: "RID-1236",
      user: "Emily Davis",
      driver: "William Brown",
      from: "Office Park",
      to: "Restaurant District",
      amount: "$18.20",
      status: "In Progress",
      date: "2023-03-28 16:15",
    },
    {
      id: "RID-1237",
      user: "Michael Wilson",
      driver: "James Miller",
      from: "Hotel",
      to: "Convention Center",
      amount: "$9.95",
      status: "Scheduled",
      date: "2023-03-28 17:30",
    },
    {
      id: "RID-1238",
      user: "Sarah Taylor",
      driver: "David Anderson",
      from: "University",
      to: "Shopping Center",
      amount: "$15.30",
      status: "Completed",
      date: "2023-03-28 13:15",
    },
  ]

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="absolute right-0 top-12">
          <Button variant="default">
            Refresh Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the current year</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                  <BarChart className="h-16 w-16 text-muted-foreground/50" />
                  <span className="ml-2 text-muted-foreground">Revenue Chart Placeholder</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New user registration</p>
                      <p className="text-xs text-muted-foreground">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Car className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">New driver onboarded</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Payment processed</p>
                      <p className="text-xs text-muted-foreground">30 minutes ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
              <CardDescription>Overview of the latest rides on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-2">ID</th>
                      <th className="text-left font-medium p-2">User</th>
                      <th className="text-left font-medium p-2">Driver</th>
                      <th className="text-left font-medium p-2">From</th>
                      <th className="text-left font-medium p-2">To</th>
                      <th className="text-left font-medium p-2">Amount</th>
                      <th className="text-left font-medium p-2">Status</th>
                      <th className="text-left font-medium p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRides.map((ride) => (
                      <tr key={ride.id} className="border-b">
                        <td className="p-2">{ride.id}</td>
                        <td className="p-2">{ride.user}</td>
                        <td className="p-2">{ride.driver}</td>
                        <td className="p-2">{ride.from}</td>
                        <td className="p-2">{ride.to}</td>
                        <td className="p-2">{ride.amount}</td>
                        <td className="p-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              ride.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : ride.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {ride.status}
                          </span>
                        </td>
                        <td className="p-2">{ride.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <BarChart className="h-16 w-16 text-muted-foreground/50" />
                <span className="ml-2 text-muted-foreground">Analytics Dashboard Placeholder</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-md">
                <BarChart className="h-16 w-16 text-muted-foreground/50" />
                <span className="ml-2 text-muted-foreground">Reports Dashboard Placeholder</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>System notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">System Notification {i}</p>
                      <p className="text-xs text-muted-foreground">{i} hour(s) ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

