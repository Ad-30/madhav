"use client"

import { LogOutIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MountainIcon, ShoppingCartIcon, LineChartIcon } from "./ui/icons";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
export default function DashboardNavbar() {
    const pathName = usePathname();
    const router = useRouter();
    const dropClick = (path: string) => {
        return () => router.push(path);
    }

    return (
        <header className="bg-background border-b px-4 md:px-6 flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2" prefetch={false}>
                <MountainIcon className="w-6 h-6" />
                <span className="font-semibold text-lg">Madhav Poshak</span>
            </Link>
            <div className="flex items-center gap-4">
                {/* <div className="flex items-center gap-4">
                    <Link href="#" className="relative" prefetch={false}>
                        <ShoppingCartIcon className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs font-medium">
                            3
                        </span>
                    </Link>
                    <Link href="#" className="relative" prefetch={false}>
                        <LineChartIcon className="w-6 h-6" />
                    </Link>
                </div> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={dropClick('/addproduct')}>Add Product</DropdownMenuItem>
                        <DropdownMenuItem onClick={dropClick('/orders')}>Orders</DropdownMenuItem>
                        <DropdownMenuItem onClick={dropClick('/inventory')}>Inventory</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}