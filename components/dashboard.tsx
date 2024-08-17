
"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"
import { Pie, PieChart, CartesianGrid, XAxis, Line, LineChart } from "recharts"
import { DownloadIcon, CalendarIcon, FilterIcon } from "lucide-react"
import DashboardNavbar from "./dashboard-navbar"
import { DashboardNavigation } from "./dashboard-navigation"
interface Order {
  id: string;
  status: string;
  amount: number;
  method: string;
  category: string;
  date: string;
}

interface CategoryCount {
  [category: string]: number;
}

interface TopSellingProduct {
  category: string;
  amount: number;
}
export function DashboardSeller() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("last30days")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const orders: Order[] = useMemo(
    () => [
      {
        id: "INV001",
        status: "Paid",
        amount: 250,
        method: "Credit Card",
        category: "Poshak",
        date: "2023-06-01",
      },
      {
        id: "INV002",
        status: "Pending",
        amount: 150,
        method: "PayPal",
        category: "Accessories",
        date: "2023-06-05",
      },
      {
        id: "INV003",
        status: "Unpaid",
        amount: 350,
        method: "Bank Transfer",
        category: "Puja Items",
        date: "2023-06-10",
      },
      {
        id: "INV004",
        status: "Paid",
        amount: 450,
        method: "Credit Card",
        category: "Poshak",
        date: "2023-06-15",
      },
      {
        id: "INV005",
        status: "Paid",
        amount: 550,
        method: "PayPal",
        category: "Accessories",
        date: "2023-06-20",
      },
    ],
    []
  );
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0)
  const categoryCounts = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.category] = (acc[order.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: (count / totalOrders) * 100,
  }))
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (selectedCategory !== "all" && order.category !== selectedCategory) {
        return false
      }
      const orderDate = new Date(order.date)
      const now = new Date()
      switch (selectedTimeRange) {
        case "last7days":
          return orderDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case "last30days":
          return orderDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case "lastyear":
          return orderDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        default:
          return true
      }
    })
  }, [orders, selectedTimeRange, selectedCategory])
  const filteredTotalOrders = filteredOrders.length
  const filteredTotalRevenue = filteredOrders.reduce((acc, order) => acc + order.amount, 0)
  const orderTrend = useMemo(() => {
    const data = []
    const now = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
      const orderCount = filteredOrders.filter((order) => {
        const orderDate = new Date(order.date)
        return (
          orderDate.getFullYear() === date.getFullYear() &&
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getDate() === date.getDate()
        )
      }).length
      data.push({ date: date.toISOString().slice(0, 10), orders: orderCount })
    }
    return data
  }, [filteredOrders])
  const revenueTrend = useMemo(() => {
    const data = []
    const now = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
      const revenue = filteredOrders
        .filter((order) => {
          const orderDate = new Date(order.date)
          return (
            orderDate.getFullYear() === date.getFullYear() &&
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getDate() === date.getDate()
          )
        })
        .reduce((acc, order) => acc + order.amount, 0)
      data.push({ date: date.toISOString().slice(0, 10), revenue })
    }
    return data
  }, [filteredOrders])
  const topSellingProducts: TopSellingProduct[] = useMemo(() => {
    const products = filteredOrders.reduce((acc: Record<string, number>, order) => {
      acc[order.category] = (acc[order.category] || 0) + order.amount;
      return acc;
    }, {});

    return Object.entries(products)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredOrders]);
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex flex-1">
        <DashboardNavigation />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="grid gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Seller Dashboard</h2>
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {selectedTimeRange === "last7days"
                            ? "Last 7 Days"
                            : selectedTimeRange === "last30days"
                              ? "Last 30 Days"
                              : "Last Year"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Time Period</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                        <DropdownMenuRadioItem value="last7days">Last 7 Days</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="last30days">Last 30 Days</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="lastyear">Last Year</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4" />
                        <span>{selectedCategory === "all" ? "All Categories" : selectedCategory}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                        <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Poshak">Poshak</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Accessories">Accessories</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Puja Items">Puja Items</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <DownloadIcon className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Orders</CardTitle>
                    <CardDescription>
                      {filteredTotalOrders} ({((filteredTotalOrders - totalOrders) / totalOrders) * 100 > 0 ? "+" : "-"}
                      {Math.abs(((filteredTotalOrders - totalOrders) / totalOrders) * 100).toFixed(2)}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{filteredTotalOrders}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                    <CardDescription>
                      ${filteredTotalRevenue.toFixed(2)} (
                      {((filteredTotalRevenue - totalRevenue) / totalRevenue) * 100 > 0 ? "+" : "-"}
                      {Math.abs(((filteredTotalRevenue - totalRevenue) / totalRevenue) * 100).toFixed(2)}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">${filteredTotalRevenue.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Total Products</CardTitle>
                    <CardDescription>{Object.keys(categoryCounts).length}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold">{Object.keys(categoryCounts).length}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PiechartcustomChart className="aspect-square" />
                  </CardContent>
                </Card>
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LinechartChart className="aspect-[9/4]" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LinechartChart className="aspect-[9/4]" />
                    </CardContent>
                  </Card>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topSellingProducts.map(({ category, amount }) => (
                        <TableRow key={category}>
                          <TableCell>{category}</TableCell>
                          <TableCell className="text-right">${amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      <footer className="bg-muted text-muted-foreground py-8">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:" />
      </footer>
    </div>
  )
}


function LinechartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}


function PiechartcustomChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          visitors: {
            label: "Visitors",
          },
          chrome: {
            label: "Chrome",
            color: "hsl(var(--chart-1))",
          },
          safari: {
            label: "Safari",
            color: "hsl(var(--chart-2))",
          },
          firefox: {
            label: "Firefox",
            color: "hsl(var(--chart-3))",
          },
          edge: {
            label: "Edge",
            color: "hsl(var(--chart-4))",
          },
          other: {
            label: "Other",
            color: "hsl(var(--chart-5))",
          },
        }}
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={[
              { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
              { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
              { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
              { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
              { browser: "other", visitors: 90, fill: "var(--color-other)" },
            ]}
            dataKey="visitors"
            nameKey="browser"
          />
        </PieChart>
      </ChartContainer>
    </div>
  )
}


