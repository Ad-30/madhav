import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Order } from '@/props/OrderProps';
import OrderComponent from './ui/order-component';

interface Filters {
  statuses: string[];
  dateRange: 'all' | 'last30days' | 'last90days';
}

interface OrdersProps {
  orders: Order[];
  loading: boolean;
}

export function Orders({ orders: initialOrders, loading }: OrdersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({ statuses: [], dateRange: 'all' });
  const [orders, setOrders] = useState(initialOrders); // Move orders state to parent

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (type: 'status' | 'dateRange', value: string) => {
    setFilters((prevFilters) => {
      if (type === 'status') {
        const newStatuses = prevFilters.statuses.includes(value)
          ? prevFilters.statuses.filter((status) => status !== value)
          : [...prevFilters.statuses, value];
        return { ...prevFilters, statuses: newStatuses };
      } else if (type === 'dateRange') {
        return { ...prevFilters, dateRange: value as 'all' | 'last30days' | 'last90days' };
      }
      return prevFilters;
    });
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
    console.log(orders)
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactNumber.includes(searchTerm);

    const matchesStatus =
      filters.statuses.length === 0 || filters.statuses.includes(order.orderStatus);

    let matchesDateRange = true;
    if (filters.dateRange === 'last30days') {
      const date30DaysAgo = new Date();
      date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
      matchesDateRange = new Date(order.orderDate) >= date30DaysAgo;
    } else if (filters.dateRange === 'last90days') {
      const date90DaysAgo = new Date();
      date90DaysAgo.setDate(date90DaysAgo.getDate() - 90);
      matchesDateRange = new Date(order.orderDate) >= date90DaysAgo;
    }

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          {loading ? (
            <Spinner size="large" className="text-black" />
          ) : (
            <div className="grid gap-8">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Orders</h2>
                <div className="flex flex-col gap-4 md:flex-row md:gap-4">
                  <div className="relative">
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
                      <DropdownMenuRadioGroup
                        value={filters.dateRange}
                        onValueChange={(value) => handleFilterChange('dateRange', value)}
                      >
                        <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="last30days">
                          Last 30 days
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="last90days">
                          Last 90 days
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map((order) => (
                  <OrderComponent
                    key={order.orderId}
                    order={order}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}