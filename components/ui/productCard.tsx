"use client";

import Link from "next/link";
import Image
    from "next/image";
import { Button } from "./button";
interface ProductCardProps {
    id: string;
    src: string;
    alt: string;
    name: string;
    price: string;
}
export function ProductCard({ id, src, alt, name, price }: ProductCardProps) {
    return (
        <div className="bg-background border rounded-lg shadow-lg overflow-hidden group">
            <Image
                src={src}
                alt={alt}
                width={400}
                height={400}
                className="w-full pt-2 px-4 h-64 object-cover group-hover:scale-105 transition-transform duration-300 bg-white"
                style={{ objectFit: "contain" }}
            />
            <div className="p-4">
                <h3 className="text-xl  mb-2">{name}</h3>
                <p className="text-lg font-bold text-black">₹ {price}</p>
                <Button
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-4"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
}