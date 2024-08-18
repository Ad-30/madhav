"use client"
import { useEffect, useState } from 'react';
import { Orders } from '@/components/orders';
import { Spinner } from '@/components/ui/spinner';

const Page = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/seller/order');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data)
                setOrders(data);
            } catch (error) {
                console.error('Fetch orders failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="flex flex-col min-h-screen w-full">
            <main className="flex-1">
                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                    {loading ? (
                        <Spinner size='large' className='text-black' />
                    ) : (
                        <Orders orders={orders} loading={loading} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Page;