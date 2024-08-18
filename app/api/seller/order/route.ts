import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import connectToDb from '@/lib/connectToDb';

export const GET = async (request: Request) => {
    try {
        await connectToDb();
        const orders = await Order.find({}).sort({ orderDate: -1 });
        return NextResponse.json(orders, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};

export const PUT = async (request: Request) => {
    try {
        await connectToDb();

        const { orderId, newStatus } = await request.json();

        if (!orderId || !newStatus) {
            return NextResponse.json({ error: 'OrderId and newStatus are required' }, { status: 400 });
        }

        const order = await Order.findOneAndUpdate(
            { orderId },
            { orderStatus: newStatus },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        console.error('Error updating order status:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};