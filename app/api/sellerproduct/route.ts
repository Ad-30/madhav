import connectToDb from "@/lib/connectToDb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
interface Product {
    _id: string;
    productId: string;
    name: string;
    description: string;
    price: Map<string, number>;
    category: string;
    images: string[];
    sizes: string[];
    stockLevels: Map<string, number>;
    createdAt: string;
    updatedAt: string;
    __v: number;
}
export const POST = async (request: Request) => {
    await connectToDb();

    try {
        const product = await request.json();

        if (!product.productName || !product.productDescription || !product.productCategory || !product.availableSizes || !product.priceLevels) {
            throw new Error("Missing required fields or invalid data format");
        }

        const productId = product.productId || generateProductId();

        // Ensure that priceLevels is a valid object with size-price pairs
        const priceLevels = product.priceLevels;
        if (typeof priceLevels !== 'object' || !Object.keys(priceLevels).length) {
            throw new Error("Invalid price levels format");
        }

        const newProduct = new Product({
            productId,
            name: product.productName,
            description: product.productDescription,
            category: product.productCategory,
            images: product.images,
            sizes: product.availableSizes,
            stockLevels: product.stockLevels,
            priceLevels,  // Save price levels based on sizes
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newProduct.save();
        return new Response(JSON.stringify({ message: "Product saved successfully!" }), { status: 201 });
    } catch (error) {
        console.error("Error saving product:", error);

        let errorMessage = "An unknown error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
    }
}

const generateProductId = (): string => {
    return Math.random().toString(36).slice(2, 18).toUpperCase();
};

export const GET = async (request: Request): Promise<NextResponse> => {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '16', 10);

        const skip = (page - 1) * itemsPerPage;

        const products = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(itemsPerPage)
            .exec();

        const totalItems = await Product.countDocuments();

        const simplifiedProducts = products.map((product: any) => {
            const stockValues = Array.from(product.stockLevels.values()) as number[];
            const totalStock = stockValues.reduce((total, stock) => total + stock, 0);

            const priceValues = Array.from(product.priceLevels.values()) as number[];
            const minPrice = Math.min(...priceValues.filter(price => price > 0));

            return {
                src: product.images[0] || '/placeholder.svg',
                id: product.productId,
                name: product.name,
                category: product.category,
                price: minPrice.toFixed(2),
                totalStock: totalStock.toString(),
            };
        });

        return NextResponse.json({
            success: true,
            data: simplifiedProducts,
            pagination: {
                currentPage: page,
                itemsPerPage: itemsPerPage,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / itemsPerPage),
            },
        });
    } catch (error) {
        console.error('Error fetching paginated products:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
};