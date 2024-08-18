"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ChevronLeftIcon, LocateIcon } from "./ui/icons";
import Cookies from "js-cookie";
import { getIndividualProduct } from "@/actions/getIndividualProduct";
import { Spinner } from "./ui/spinner";
import { createOrder } from "@/actions/createOrder";
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext";
import { useRouter } from 'next/navigation';

interface CheckoutItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

export function Checkout() {
  const { toast } = useToast()
  const { updateCart } = useCart();
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    setIsFetching(true);

    const cartCookie = Cookies.get("cart");
    if (cartCookie) {
      const parsedCart = JSON.parse(cartCookie);

      const fetchProductDetails = async () => {
        const itemsWithDetails = await Promise.all(
          parsedCart.map(async (item: { productId: string; size: string; quantity: number }) => {
            const productDetails = await getIndividualProduct({ id: item.productId });
            const product = productDetails.data;
            const stockLevel = product.stockLevels[item.size.toUpperCase()] || 0;
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

        setCheckoutItems(itemsWithDetails);
        setTotalAmount(checkoutItems
          .filter(item => item.stock > 0)
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2))
        setIsFetching(false);
      };

      fetchProductDetails().catch((error) =>
        console.error("Failed to fetch product details", error)
      );
    }
  }, []);
  const handleOrderSuccess = (orderId: string, customerName: string, streetAddress: string, checkoutItems: CheckoutItem[], totalAmount: number) => {
    // Construct the WhatsApp message
    const orderDetails = checkoutItems
      .map(item => `${item.name} (Size: ${item.size}) - Quantity: ${item.quantity} - Price: ₹${item.price}`)
      .join('\n');

    const whatsappMessage = `🎉 *Hurray! Your order has been placed successfully!* 🎉\n\n🆔 *Order ID:* #${orderId}\n\n👤 *Customer Name:* ${customerName}\n\n📍 *Delivery Address:* \n${streetAddress},\nJaipur, Rajasthan, 303104\n\n🛒 *Order Details:*\n${checkoutItems.map((item) => `• ${item.name} (Size: ${item.size}) - Qty: ${item.quantity} @ ₹${item.price}`).join('\n')}\n\n💰 *Total Price:* ₹${totalAmount}\n\n🔗 *Track your order here:* ${window.location.origin}/order?orderId=${orderId}\n\n🙏 *Thank you for shopping with us!* 🙏`;

    // Encode the message for the WhatsApp URL
    const encodedMessage = encodeURIComponent(whatsappMessage.trim());

    // Redirect to WhatsApp
    window.location.href = `https://wa.me/7742245155?text=${encodedMessage}`;
  };

  const handleConfirmButton = async () => {
    setIsCreatingOrder(true);
    if (!customerName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Customer Name is required!",
        duration: 2000,
      });
      setIsCreatingOrder(false);
      return;
    }
    if (!contactNumber) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Contact number is required!",
        duration: 2000,
      });
      setIsCreatingOrder(false);
      return;
    }

    if (!streetAddress) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Address is required!",
        duration: 2000,
      });
      setIsCreatingOrder(false);
      return;
    }

    const totalAmount = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const generateRandomOrderId = () => {
      return Math.random().toString(36).substring(2, 18).toUpperCase();
    };
    const order = {
      orderId: generateRandomOrderId(),
      customerName: customerName,
      address: {
        street: streetAddress,
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '303104',
      },
      contactNumber: contactNumber || "",
      orderDate: new Date(),
      orderStatus: 'Pending',
      totalAmount: parseInt(totalAmount.toString(), 10),
      products: checkoutItems.map(item => ({
        productId: item.id,
        size: item.size,
        currentPrice: item.price,
        name: item.name,
        quantity: item.quantity,
      })),
      distanceFromStore: 0,
      whatsappMessageSent: false,
    };

    try {
      const response = await createOrder(order);

      if (response.success) {
        const cartCookie = Cookies.get("cart");
        if (cartCookie) {
          const parsedCart = JSON.parse(cartCookie);
          parsedCart.splice(0, parsedCart.length);
          Cookies.set('cart', JSON.stringify(parsedCart));
          updateCart();
        }
        setCheckoutItems([]);


        // toast({
        //   variant: "success",
        //   title: "Success",
        //   description: "Order created successfully!",
        // });
        const orderId = response.data?.orderId;
        if (orderId) {
          handleOrderSuccess(orderId, customerName, streetAddress, checkoutItems, totalAmount);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.error || "Failed to create order.",
        });
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while creating the order.",
      });
    }
    setIsCreatingOrder(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="grid md:grid-cols-[1fr_400px] gap-8">
            {/* Checkout Items */}
            <div className="grid gap-6">
              {checkoutItems.length > 0 ? (
                checkoutItems
                  .filter(item => item.stock > 0)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="relative grid md:grid-cols-[100px_1fr_100px_100px] items-center gap-4 border-b pb-4"
                    >
                      <img
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
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue={String(item.quantity)} disabled>
                          <SelectTrigger>
                            <SelectValue placeholder={String(item.quantity)} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-right font-semibold">
                        ₹{item.price.toFixed(2)}
                      </div>
                    </div>
                  ))
              ) : (<>
                {isFetching ? <Spinner size="large" className="text-black" /> : <p>Your checkout is empty.</p>}
              </>

              )}
            </div>

            {/* Order Summary */}
            <div className="bg-muted rounded-lg p-6 grid gap-4">
              <h2 className="text-2xl font-bold">Order Summary</h2>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    ₹
                    {totalAmount}
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
                    {checkoutItems
                      .filter(item => item.stock > 0)
                      .reduce((total, item) => total + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="mt-8 bg-muted rounded-lg p-6 grid gap-6">
            <h2 className="text-2xl font-bold">Delivery Information</h2>
            <form className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name<span className="text-red-600">*</span></Label>
                <Input id="name" placeholder="Enter your name" onChange={(event) => setCustomerName(event.target.value)} />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode/ZIP Code</Label>
                <Input id="pincode" placeholder="Enter your pincode/ZIP code" />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="mobile">Contact no.<span className="text-red-600">*</span></Label>
                <Input id="mobile no." type="number" placeholder="Enter your mobile no." onChange={(event) => setContactNumber(String(event.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Street Address<span className="text-red-600">*</span></Label>
                <Input id="address" placeholder="Enter your street address" onChange={(event) => setStreetAddress(event.target.value)} />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Enter your city" />
              </div> */}
              {/* <div className="grid gap-2">
                <Label htmlFor="state">State/Region</Label>
                <Input id="state" placeholder="Enter your state/region" />
              </div> */}
              {/* <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Enter your country" />
              </div> */}
              {/* <Button variant="outline" className="w-full md:w-auto">
                <LocateIcon className="w-4 h-4 mr-2" />
                Locate Me
              </Button> */}
            </form>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeftIcon />Back
            </button>
            {isCreatingOrder ? <Button size="lg" onClick={handleConfirmButton} disabled><Spinner size="large" className="text-black" /></Button> : <>{checkoutItems.length > 0 ? <Button size="lg" onClick={handleConfirmButton} >Confirm Order</Button> : <Button size="lg" onClick={handleConfirmButton} disabled>Confirm Order</Button>}</>}
            {/* {checkoutItems.length > 0 ? <Button size="lg" onClick={handleConfirmButton} >Confirm Order</Button> : <Button size="lg" onClick={handleConfirmButton} disabled>Confirm Order</Button>} */}
          </div>
        </div>
      </main >
      <Footer />
    </div >
  );
}
