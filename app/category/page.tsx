'use client'
import { Products } from "@/components/products";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { getProducts } from "@/actions/getProducts";
import { NotAvailable } from "@/components/not-available";

interface Product {
    src: string;
    id: string;
    name: string;
    category: string;
    price: string;
    totalStock: string;
    alt: string;
}

const Page = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const searchParams = useSearchParams();
    const category = searchParams.get('category') || 'Poshak';

    const fetchData = async () => {
        const response = await getProducts({ offset: 0, limit: 8, category });
        setProducts(response.data);
        setTotalItems(response.totalItems);
        if (totalItems === 0) {
            return <NotAvailable />;
        }
        // console.log(response);
    };

    useEffect(() => {
        fetchData();
    }, [category]);

    return (
        <>

            <Products products={products} totalItems={totalItems} />
        </>
    );
};

export default Page;