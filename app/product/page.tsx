'use client';
import { IndividualProduct } from "@/components/individual-product";
import { useState, useEffect } from "react";
import { getIndividualProduct } from "@/actions/getIndividualProduct";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { CartProvider } from "@/contexts/CartContext";

interface ProductProps {
    _id: string;
    productId: string;
    name: string;
    description: string;
    price: Record<string, number>;
    category: string;
    images: string[];
    sizes: string[];
    stockLevels: Map<string, number>;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const Page = () => {
    const [product, setProduct] = useState<ProductProps | null>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '2N5PJKATOI'; // Default ID for testing

    const fetchProduct = async () => {
        try {
            const productFetched = await getIndividualProduct({ id });
            console.log(productFetched)

            // Check if the product data exists
            if (productFetched && productFetched.data) {
                setProduct(productFetched.data);
            } else {
                console.error("Product data is undefined or null.");
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    return (
        <>
            <CartProvider>
                {product ? (
                    <IndividualProduct product={product} />
                ) : (
                    <div className="h-screen w-screen flex justify-center items-center">
                        <Spinner className="text-black" size="large" />
                    </div>
                )}
            </CartProvider>
        </>
    );
};

export default Page;