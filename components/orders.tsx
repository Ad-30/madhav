import { useState } from 'react';
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilePenIcon, SearchIcon, FilterIcon } from "./ui/icons";
interface Filters {
  statuses: string[];
  dateRange: 'all' | 'last30days' | 'last90days';
}
export function Orders() {
  const initialOrders = [
    { id: 1234, status: "Pending", date: 'August 10, 2024', customerName: 'John Doe', customerEmail: 'johndoe@example.com', total: '99.99' },
    { id: 2345, status: "Shipped", date: 'June 5, 2023', customerName: 'Jane Smith', customerEmail: 'janesmith@example.com', total: '149.99' },
    { id: 3456, status: "Delivered", date: 'June 10, 2023', customerName: 'Michael Johnson', customerEmail: 'mjohnson@example.com', total: '79.99' },
    { id: 4567, status: "Cancelled", date: 'June 15, 2023', customerName: 'Emily Davis', customerEmail: 'edavis@example.com', total: '59.99' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({ statuses: [], dateRange: 'all' });

  const filteredOrders = initialOrders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      || order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(order.status);

    let matchesDateRange = true;
    if (filters.dateRange === 'last30days') {
      const date30DaysAgo = new Date();
      date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
      matchesDateRange = new Date(order.date) >= date30DaysAgo;
    } else if (filters.dateRange === 'last90days') {
      const date90DaysAgo = new Date();
      date90DaysAgo.setDate(date90DaysAgo.getDate() - 90);
      matchesDateRange = new Date(order.date) >= date90DaysAgo;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (type: 'status' | 'dateRange', value: string) => {
    setFilters(prevFilters => {
      if (type === 'status') {
        const newStatuses = prevFilters.statuses.includes(value)
          ? prevFilters.statuses.filter(status => status !== value)
          : [...prevFilters.statuses, value];
        return { ...prevFilters, statuses: newStatuses };
      } else if (type === 'dateRange') {
        return { ...prevFilters, dateRange: value as 'all' | 'last30days' | 'last90days' };
      }
      return prevFilters;
    });
  };
  type BadgeVariant = "default" | "secondary" | "destructive" | "pending" | "cancelled" | "delivered" | "shipped" | "outline";

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Orders</h2>
              <div className="flex flex-col gap-4 md:flex-row md:gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-8 pr-4 py-2 rounded-md bg-muted/20 focus:bg-background focus:ring-1 focus:ring-primary"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FilterIcon className="h-4 w-4" />
                      <span>Filters</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.statuses.includes('Pending')}
                      onCheckedChange={() => handleFilterChange('status', 'Pending')}
                    >
                      Pending
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.statuses.includes('Shipped')}
                      onCheckedChange={() => handleFilterChange('status', 'Shipped')}
                    >
                      Shipped
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.statuses.includes('Delivered')}
                      onCheckedChange={() => handleFilterChange('status', 'Delivered')}
                    >
                      Delivered
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.statuses.includes('Cancelled')}
                      onCheckedChange={() => handleFilterChange('status', 'Cancelled')}
                    >
                      Cancelled
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
                      <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="last30days">Last 30 days</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="last90days">Last 90 days</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Order #{order.id}</div>
                      <Badge variant={order.status.toLowerCase() as BadgeVariant}>{order.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Placed on {order.date}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      </div>
                      <div className="font-medium">${order.total}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <FilePenIcon className="h-4 w-4" />
                          <span>Update Status</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Pending</DropdownMenuItem>
                        <DropdownMenuItem>Shipped</DropdownMenuItem>
                        <DropdownMenuItem>Delivered</DropdownMenuItem>
                        <DropdownMenuItem>Cancelled</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}