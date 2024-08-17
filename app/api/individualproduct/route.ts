import connectToDb from "@/lib/connectToDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export const GET = async (request: Request): Promise<NextResponse> => {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (productId) {
            const product = await Product.findOne({ productId });

            if (!product) {
                return NextResponse.json({
                    success: false,
                    message: "Product not found",
                }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: product,
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Product id is required",
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching product by id:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const PUT = async (request: Request): Promise<NextResponse> => {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({
                success: false,
                message: "Product id is required",
            }, { status: 400 });
        }

        const product = await Product.findOne({ productId });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found",
            }, { status: 404 });
        }

        const updatedData = await request.json();

        // Update the product fields with the data received from the request
        Object.keys(updatedData).forEach((key) => {
            if (key in product.toObject()) {
                product[key] = updatedData[key];
            } else {
                console.warn(`Field '${key}' is not a valid product field.`);
            }
        });

        await product.save();

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};

export const DELETE = async (request: Request): Promise<NextResponse> => {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({
                success: false,
                message: "Product id is required",
            }, { status: 400 });
        }

        const product = await Product.findOne({ productId });

        if (!product) {
            return NextResponse.json({
                success: false,
                message: "Product not found",
            }, { status: 404 });
        }

        await Product.deleteOne({ productId });

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};