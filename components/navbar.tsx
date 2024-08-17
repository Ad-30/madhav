"use client"
import Link from "next/link";
import { MountainIcon, ShoppingCartIcon } from "./ui/icons";
import { useCart } from "../contexts/CartContext";
import { useEffect } from "react";
import NumberTicker from "@/components/magicui/number-ticker";


export function Navbar() {
    const { cartCount, updateCart } = useCart();

    useEffect(() => {
        updateCart();
    }, [updateCart]);

    return (
        <header className="bg-background border-b px-4 md:px-6 flex items-center justify-between h-16 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <MountainIcon className="w-6 h-6" />
                <span className="font-semibold text-lg">Madhav</span>
            </Link>
            <div className="flex items-center gap-4">
                <Link href="/cart" className="relative" prefetch={false}>
                    <ShoppingCartIcon className="w-6 h-6" />
                    {cartCount > 0 &&
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-medium">
                            {/* <SparklesText text={String(cartCount)} className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-medium" /> */}
                            {/* {cartCount} */}
                            <NumberTicker value={cartCount} className="text-primary-foreground text-xs font-medium" />
                        </span>
                    }

                </Link>
            </div>
        </header>
    );
}