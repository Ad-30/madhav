"use client";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
    src: string;
    alt: string;
    heading: string;
    description: string;
    link: string;
}

export function CategoryCard({ src, alt, heading, description, link }: CategoryCardProps) {
    return (
        <Link href={link} className="bg-background border rounded-lg shadow-lg overflow-hidden group" prefetch={false}>
            <div className="relative w-full h-48 bg-white transition-transform duration-300 group-hover:scale-105">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    style={{ objectFit: "contain" }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{heading}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
        </Link>
    );
}