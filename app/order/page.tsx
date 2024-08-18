"use client";
import { OrderComponent } from "@/components/order-component";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";

const Page = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";

    if (orderId.length < 10) {
        notFound();
    }

    return <OrderComponent orderId={orderId} />;
};

export default Page;