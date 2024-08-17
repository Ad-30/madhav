"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { getIndividualProduct } from "@/actions/getIndividualProduct";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { TrashIcon } from "./ui/icons";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";


interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}
interface CartCookieItem {
  productId: string;
  size: string;
  quantity: string;
}

export function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cartTotal, setCartTotal] = useState("");
  const { updateCart } = useCart();
  useEffect(() => {
    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      const parsedCart = JSON.parse(cartCookie);

      const fetchProductDetails = async () => {
        const itemsWithDetails = await Promise.all(
          parsedCart.map(async (item: CartCookieItem) => {
            const productDetails = await getIndividualProduct({ id: item.productId });
            const product = productDetails.data;
            const stockLevel = 0 || product.stockLevels[item.size.toUpperCase()];
            return {
              id: product.productId,
              name: product.name,
              price: product.priceLevels[item.size.toUpperCase()],
              imageUrl: product.images[0],
              size: item.size,
              quantity: item.quantity,
              stock: stockLevel,
            };
          })
        );

        setCartItems(itemsWithDetails);
      };

      fetchProductDetails().catch((error) =>
        console.error("Failed to fetch product details", error)
      );
    }
  }, []);

  const handleRemoveItem = () => {
    if (!itemToRemove) return;

    const oldCartString = Cookies.get('cart');
    const oldCart: CartCookieItem[] | null = oldCartString ? JSON.parse(oldCartString) : [];
    // const newCart = Array.isArray(oldCart) ? oldCart.filter((cartProduct) => cartProduct.productId !== itemToRemove.id) : [];
    const indexToRemove: number = Array.isArray(oldCart)
      ? oldCart.findIndex(item => item.productId === itemToRemove.id && item.size === itemToRemove.size)
      : -1;
    oldCart?.splice(indexToRemove, 1);
    Cookies.set("cart", JSON.stringify(oldCart));
    setCartItems(cartItems.filter(item =>
      !(item.id === itemToRemove.id && item.size === itemToRemove.size)
    ));
    setIsDialogOpen(false);
    setItemToRemove(null);
    updateCart();
  };

  const handleQuantityChange = (id: string, newQuantity: string, size: string) => {
    const existingCart = Cookies.get('cart');
    let cart: CartCookieItem[] = existingCart ? JSON.parse(existingCart) : [];
    const cartProductItemId: string = id;
    const checkIfIdAndSizeExists = (existingCart: CartCookieItem[], idToCheck: string, sizeToCheck: string): boolean => {
      return existingCart.some(item => item.productId === idToCheck && item.size === sizeToCheck);
    };
    if (checkIfIdAndSizeExists(cart, id, size)) {
      const index = cart.findIndex(item => item.productId === id && item.size === size);
      cart[index].quantity = String(newQuantity);
      const cartItemIndex = cartItems.findIndex(item => item.id === id && item.size === size);
      cartItems[cartItemIndex].quantity = Number(newQuantity);
      calculateCartTotal();
    }
    Cookies.set('cart', JSON.stringify(cart));
  }

  const calculateCartTotal = () => {
    setCartTotal(cartItems
      .filter(item => item.stock > 0)
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2));
  }
  useEffect(() => {
    calculateCartTotal();
  }, [cartItems]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="grid md:grid-cols-[1fr_400px] gap-8">
            {/* Cart Items */}
            <div className="grid gap-6">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => {
                  const isOutOfStock = item.stock === 0;

                  return (
                    <div
                      key={index}
                      className={`relative grid md:grid-cols-[100px_1fr_100px_100px] items-center gap-4 border-b pb-4 ${isOutOfStock ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                        style={{ aspectRatio: "100/100", objectFit: "contain" }}
                      />
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">Size: {item.size}</p>
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center text-red-500 text-lg font-bold bg-white/80">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={String(item.quantity > item.stock ? item.stock : item.quantity)} onValueChange={(value) => handleQuantityChange(item.id, value, item.size)}>
                          <SelectTrigger>
                            <SelectValue placeholder={String(item.quantity)} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: item.stock }, (_, index) => (
                              <SelectItem key={index} value={String(index + 1)}>{index + 1}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          disabled={isOutOfStock}
                          onClick={() => {
                            setItemToRemove(item);
                            setIsDialogOpen(true);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <div className="text-right font-semibold">
                        ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Your cart is empty.</p>
              )}
              {/* {cartItems.length > 0 ?
                <Button size="lg">Update Cart</Button>
                :
                <Button size="lg" className="pointer-events-none opacity-50">
                  Update Cart
                </Button>
              } */}
            </div>

            {/* Cart Summary */}
            <div className="bg-muted rounded-lg p-6 grid gap-4">
              <h2 className="text-2xl font-bold">Cart Summary</h2>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₹
                    {cartItems
                      .filter(item => item.stock > 0)
                      .reduce((total, item) => total + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="text-2xl font-bold">
                    ₹
                    {cartItems
                      .filter(item => item.stock > 0)
                      .reduce((total, item) => total + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  prefetch={false}
                >
                  Continue Shopping
                </Link>
                {cartItems.length > 0 ?
                  <Link href="/checkout" >
                    <Button size="lg" className="w-full">Proceed to Checkout</Button>
                  </Link>
                  :
                  <Button size="lg" className="pointer-events-none opacity-50">
                    Proceed to Checkout
                  </Button>
                }
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Move Dialog here, outside the map */}
      {itemToRemove && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to remove {itemToRemove.name} from the cart?</p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRemoveItem}>
                Yes, Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}