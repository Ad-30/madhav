import React, { useState } from 'react';
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilePenIcon } from './icons';
import { Order } from '@/props/OrderProps';
import { updateOrderStatus } from '@/actions/putOrder';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from "@/components/ui/use-toast";
import { Spinner } from './spinner';

interface OrderComponentProps {
    order: Order;
    onStatusChange: (orderId: string, newStatus: string) => void;
}

const OrderComponent: React.FC<OrderComponentProps> = ({ order: initialOrder, onStatusChange }) => {
    const [order, setOrder] = useState<Order>(initialOrder);
    const [selectedStatus, setSelectedStatus] = useState<string>(order.orderStatus);
    const [loading, setLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    const handleStatusUpdate = (newStatus: string) => {
        if (order.orderStatus !== newStatus) {
            onStatusChange(order.orderId, newStatus);
        }
    };

    const handleStatusChange = async () => {
        if (selectedStatus === order.orderStatus) {
            // Status hasn't changed, don't make the request
            toast({ title: "Info", description: "Order status is already set to the selected value." });
            setOpenDialog(false);
            return;
        }

        setLoading(true);
        try {
            const response = await updateOrderStatus(order.orderId, selectedStatus);
            console.log(response); // response from API

            // Update the current order with the new data
            setOrder(response);
            handleStatusUpdate(selectedStatus);

            toast({ variant: "success", title: "Success", description: "Order status updated successfully!" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update order status." });
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="font-medium">Order #{order.orderId}</div>
                    <Badge variant={String(order.orderStatus.toLowerCase()) as "default" | "destructive" | "outline" | "secondary" | "pending" | "cancelled" | "delivered" | "shipped"}>
                        {order.orderStatus}
                    </Badge>
                </div>
                <div className="text-sm text-muted-foreground font-light">Placed on {formatDate(order.orderDate)}</div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">{order.customerName}</div>
                    </div>
                    <div className="font-medium">₹{order.totalAmount}</div>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Link href={`/order?orderId=${order.orderId}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                </Link>
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
                        <DropdownMenuCheckboxItem
                            checked={selectedStatus === 'Pending'}
                            onCheckedChange={() => { setSelectedStatus('Pending'); setOpenDialog(true); }}
                        >
                            Pending
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatus === 'Shipped'}
                            onCheckedChange={() => { setSelectedStatus('Shipped'); setOpenDialog(true); }}
                        >
                            Shipped
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatus === 'Delivered'}
                            onCheckedChange={() => { setSelectedStatus('Delivered'); setOpenDialog(true); }}
                        >
                            Delivered
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={selectedStatus === 'Cancelled'}
                            onCheckedChange={() => { setSelectedStatus('Cancelled'); setOpenDialog(true); }}
                        >
                            Cancelled
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent >
                </DropdownMenu >

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Confirm Status Update</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to update the order status to "{selectedStatus}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                            <Button variant="default" onClick={handleStatusChange}>
                                {loading ? <Spinner className="text-black" size="large" /> : "Confirm"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter >
        </Card >
    );
};

export default OrderComponent;