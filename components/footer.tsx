import Link from "next/link";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "./ui/icons";
export function Footer() {
    return (
        <footer className="bg-muted text-muted-foreground py-8">
            <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                    <p>
                        123 Main Street
                        <br />
                        Anytown, USA 12345
                        <br />
                        Phone: (123) 456-7890
                        <br />
                        Email: info@pujamandir.com
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">About Us</h3>
                    <p>
                        Puja Mandir is a leading e-commerce platform specializing in traditional puja items and dresses. We are
                        committed to preserving and promoting Indian culture and heritage.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                        <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                            <FacebookIcon className="w-6 h-6" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                            <InstagramIcon className="w-6 h-6" />
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
                            <TwitterIcon className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}