'use client';
import { IndividualProduct } from "@/components/individual-product";
import { useState, useEffect } from "react";
import { getIndividualProduct } from "@/actions/getIndividualProduct";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { CartProvider } from "@/contexts/CartContext";
import { ProductProps } from "@/props/ProductProps";


const Page = () => {
    const [product, setProduct] = useState<ProductProps | null>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get('id') || '';

    const fetchProduct = async () => {
        try {
            const productFetched = await getIndividualProduct({ id });

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