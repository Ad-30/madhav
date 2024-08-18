import connectToDb from "@/lib/connectToDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

interface Product {
    _id: string;
    productId: string;
    name: string;
    description: string;
    priceLevels: Map<string, number>;
    category: string;
    images: string[];
    sizes: string[];
    stockLevels: Map<string, number>;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const GET = async (request: Request): Promise<NextResponse> => {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);

        if (searchParams.get('id')) {
            const productId = searchParams.get('id');
            const product = await Product.findOne({ productId });

            if (!product) {
                return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
            }

            return NextResponse.json({
                success: true,
                data: {
                    id: product.productId,
                    name: product.name,
                    description: product.description,
                    priceLevels: product.priceLevels,
                    category: product.category,
                    images: product.images,
                    sizes: product.sizes,
                    stockLevels: product.stockLevels,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                },
            });
        } else {
            const offset = parseInt(searchParams.get('offset') || '0', 10);
            const limit = parseInt(searchParams.get('limit') || '16', 10);
            const category = searchParams.get('category') || 'Poshak';

            const products: Product[] = await Product.find({ category })
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit)
                .exec();

            const totalItems = await Product.countDocuments({ category });

            const simplifiedProducts = products.map(product => ({
                src: product.images[0] || '/placeholder.svg',
                id: product.productId,
                name: product.name,
                category: product.category,
                price: Math.min(
                    ...Array.from(product.priceLevels.values()).filter(price => price > 0)
                ).toFixed(2),
                totalStock: Array.from(product.stockLevels.values())
                    .reduce((total, stock) => total + stock, 0)
                    .toString()
            }));

            return NextResponse.json({
                success: true,
                data: simplifiedProducts,
                totalItems: totalItems,
            });
        }
    } catch (error) {
        console.error('Error fetching products with infinite scroll:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};