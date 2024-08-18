export interface Order {
    _id: string;
    orderId: string;
    customerName: string;
    contactNumber: string;
    orderDate: string;
    orderStatus: string;
    totalAmount: number;
    products: {
        productId: string;
        size: string;
        currentPrice: number;
        name: string;
        quantity: number;
        _id: string;
    }[];
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    distanceFromStore: number;
    whatsappMessageSent: boolean;
}