import Order from "@/models/Order";

export const getSellerOrders = async () => {
    try {
        const response = await fetch('/api/seller/order');
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const orders = await response.json();
        return orders;
    } catch (error: any) {
        console.error('Error fetching seller orders:', error);
        throw new Error('Failed to fetch seller orders');
    }
};