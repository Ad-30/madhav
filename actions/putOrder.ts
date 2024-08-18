import axios from 'axios';

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
        const response = await axios.put('/api/seller/order', {
            orderId,
            newStatus
        });

        return response.data;
    } catch (error: any) {
        console.error('Error updating order status:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to update order status');
    }
};