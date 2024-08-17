"use client";
import { OrderComponent } from "@/components/order-component";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation"; // Import the notFound function

const Page = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "";

    // Check if the orderId is valid (length is 12 or more)
    if (orderId.length < 10) {
        notFound(); // Show 404 page
    }

    return <OrderComponent orderId={orderId} />;
};

export default Page;