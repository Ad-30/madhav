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