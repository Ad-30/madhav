"use client"
import Link from "next/link";
import { LineChartIcon, PackageIcon, ShoppingCartIcon } from "./ui/icons";
import { PackagePlus } from "lucide-react";
import { usePathname } from "next/navigation";

export function DashboardNavigation() {
    const pathName = usePathname();
    return (
        <aside className="bg-muted border-r px-4 py-6 flex flex-col gap-6 w-1/5 hidden lg:block space-y-4">
            <Link href="/" className={`flex items-center gap-2 text-lg font-medium rounded-sm ${pathName == "/home" ? 'bg-white' : ''} px-3 py-2`} prefetch={false}>
                <LineChartIcon className="w-6 h-6" />
                Home
            </Link>
            <Link href="/addproduct" className={`flex items-center gap-2 text-lg font-medium rounded-sm ${pathName == "/addproduct" ? 'bg-white' : ''} px-3 py-2`} prefetch={false}>
                <PackagePlus className="w-6 h-6" />
                Add Product
            </Link>
            <Link href="/orders" className={`flex items-center gap-2 text-lg font-medium rounded-sm ${pathName == "/orders" ? 'bg-white' : ''} px-3 py-2`} prefetch={false}>
                <ShoppingCartIcon className="w-6 h-6" />
                Orders
            </Link>
            <Link href="/inventory" className={`flex items-center gap-2 text-lg font-medium rounded-sm ${pathName == "/inventory" ? 'bg-white' : ''} px-3 py-2`} prefetch={false}>
                <PackageIcon className="w-6 h-6" />
                Inventory
            </Link>

        </aside>
    );
}