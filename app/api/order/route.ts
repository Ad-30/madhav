import { NextResponse } from 'next/server';
import Order from '@/models/Order';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import connectToDb from '@/lib/connectToDb';

const validateOrderData = (data: any) => {
    const { orderId, customerName, address, contactNumber, orderStatus, totalAmount, products, distanceFromStore } = data;

    if (!orderId || typeof orderId !== 'string') return { isValid: false, message: 'Invalid or missing orderId' };
    if (!customerName || typeof customerName !== 'string') return { isValid: false, message: 'Invalid or missing customerName' };

    if (!address || typeof address !== 'object') return { isValid: false, message: 'Invalid or missing address' };
    const { street, city, state, pincode } = address;
    if (!street || typeof street !== 'string') return { isValid: false, message: 'Invalid or missing street' };
    if (!city || typeof city !== 'string') return { isValid: false, message: 'Invalid or missing city' };
    if (!state || typeof state !== 'string') return { isValid: false, message: 'Invalid or missing state' };
    if (!pincode || typeof pincode !== 'string') return { isValid: false, message: 'Invalid or missing pincode' };

    if (!contactNumber || typeof contactNumber !== 'string') return { isValid: false, message: 'Invalid or missing contactNumber' };
    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) return { isValid: false, message: 'Invalid orderStatus' };
    if (typeof totalAmount !== 'number' || totalAmount <= 0) return { isValid: false, message: 'Invalid or missing totalAmount' };

    if (!Array.isArray(products) || products.length === 0) return { isValid: false, message: 'Products must be a non-empty array' };
    for (const product of products) {
        const { productId, size, currentPrice, name, quantity } = product;
        if (!productId || typeof productId !== 'string') return { isValid: false, message: 'Invalid or missing productId in products' };
        if (!size || typeof size !== 'string') return { isValid: false, message: 'Invalid or missing size in products' };
        if (typeof currentPrice !== 'number' || currentPrice <= 0) return { isValid: false, message: 'Invalid or missing currentPrice in products' };
        if (!name || typeof name !== 'string') return { isValid: false, message: 'Invalid or missing name in products' };
        if (isNaN(Number(quantity))) return { isValid: false, message: 'Invalid or missing quantity in products' }; // Validate quantity
    }

    if (typeof distanceFromStore !== 'number' || distanceFromStore < 0) return { isValid: false, message: 'Invalid or missing distanceFromStore' };

    return { isValid: true };
};

export const POST = async (request: Request) => {
    try {
        await connectToDb();

        const body = await request.json();

        const { isValid, message } = validateOrderData(body);
        if (!isValid) {
            return NextResponse.json({ error: message }, { status: 400 });
        }

        const newOrder = new Order(body);

        const savedOrder = await newOrder.save();

        for (const product of body.products) {
            const { productId, size, quantity } = product;
            const upperCaseSize = size.toUpperCase();
            const quantityNumber = parseInt(quantity, 10);
            if (isNaN(quantityNumber)) {
                console.error(`Invalid quantity value: ${quantity}`);
                return NextResponse.json({ error: 'Invalid quantity value' }, { status: 400 });
            }

            await Product.findOneAndUpdate(
                { productId: productId },
                { $inc: { [`stockLevels.${upperCaseSize}`]: -quantityNumber } },
                { new: true }
            );
        }

        return NextResponse.json(savedOrder, { status: 201 });

    } catch (error: any) {
        console.error('Error creating order:', error);

        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};

export const GET = async (request: Request) => {
    try {
        await connectToDb();

        const url = new URL(request.url);
        const orderId = url.searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json({ error: 'No orderId provided' }, { status: 400 });
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
};