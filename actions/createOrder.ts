import axios from 'axios';

export interface Order {
    orderId: string;
    customerName: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    contactNumber: string;
    orderStatus: string;
    totalAmount: number;
    products: {
        productId: string;
        size: string;
        currentPrice: number;
        name: string;
        quantity: number;
    }[];
    distanceFromStore: number;
    whatsappMessageSent: boolean;
}

// Function to create a new order by sending a POST request with axios
export async function createOrder(order: Order): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
        const response = await axios.post('/api/order', order, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Return the newly created order upon success
        return {
            success: true,
            data: response.data,
        };

    } catch (error: any) {
        // Handle the error responses based on axios's error object
        const errorMessage = error.response?.data?.error || 'Failed to create order.';

        return {
            success: false,
            error: errorMessage,
        };
    }
}

export const getOrderById = async (orderId: string) => {
    if (!orderId) {
        throw new Error('No orderId provided');
    }

    try {
        const response = await axios.get('/api/orders', {
            params: { orderId },
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error('Error in getOrderById:', error.response.data);
            throw new Error(error.response.data.error || 'Error fetching order');
        } else {
            console.error('Error in getOrderById:', error.message);
            throw new Error(error.message || 'Unknown error occurred while fetching order');
        }
    }
};