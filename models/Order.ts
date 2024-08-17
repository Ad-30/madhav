import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
    orderId: string;
    customerName: string;
    address: {
        street: string;
        city: string;
        state: string;
        pincode: string;
    };
    contactNumber: string;
    orderDate: Date;
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

const OrderSchema: Schema<IOrder> = new Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    customerName: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], // Update statuses as needed
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    products: [{
        productId: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        currentPrice: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    distanceFromStore: {
        type: Number,
        required: true,
    },
    whatsappMessageSent: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;