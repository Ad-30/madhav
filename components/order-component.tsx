import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Footer } from "./footer";
import { MoveVerticalIcon, TruckIcon } from "./ui/icons";
import { Navbar } from "./navbar";
import { Spinner } from "./ui/spinner";
import { getIndividualProduct } from "@/actions/getIndividualProduct";
import { Badge } from "./ui/badge";

interface Product {
  productId: string;
  name: string;
  size: string;
  currentPrice: number;
  quantity: number;
  imageUrl?: string; // Add this field to store the image URL
}
interface Order {
  orderId: string;
  customerName: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  contactNumber: string;
  orderStatus: string;
  totalAmount: number;
  products: Product[];
  orderDate: string;
}

export function OrderComponent({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mapOrderStatusToVariant = (status: string): "default" | "secondary" | "destructive" | "pending" | "cancelled" | "delivered" | "shipped" | "outline" => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "cancelled":
        return "cancelled";
      case "delivered":
        return "delivered";
      case "shipped":
        return "shipped";
      default:
        return "default";
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/order?orderId=${orderId}`);
        const fetchedOrder = response.data;

        const updatedProducts = await Promise.all(
          fetchedOrder.products.map(async (product: Product) => {
            const productData = await getIndividualProduct({ id: product.productId });
            return {
              ...product,
              imageUrl: productData.data.images[0],
            };
          })
        );
        setOrder({ ...fetchedOrder, products: updatedProducts });
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="flex w-screen h-screen justify-center items-center "><Spinner size="large" className="text-black" /></div>;

  if (error) return <div className="flex w-screen h-screen justify-center items-center ">{error}</div>;

  if (!order) return <div className="flex w-screen h-screen justify-center items-center ">No order found</div>;

  const formattedOrderDate = new Date(order.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid gap-8">
            {order && (
              <>
                <div className="grid gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <h1 className="text-3xl font-bold">
                      Order <span className="text-muted-foreground">#{order.orderId}</span>
                    </h1>
                    <div className="text-muted-foreground mt-2 sm:mt-0">
                      Order Date: {formattedOrderDate}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-6 grid gap-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Order Summary</h2>
                      <Badge variant={mapOrderStatusToVariant(order.orderStatus.toLowerCase())} >{order.orderStatus}</Badge>
                    </div>

                    <div className="grid gap-4">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="grid md:grid-cols-[100px_1fr_auto_auto] items-center gap-4 border-b pb-4"
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover bg-white"
                            style={{ aspectRatio: "100/100", objectFit: "contain" }}
                          />
                          <div className="grid gap-1">
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-muted-foreground text-sm">({product.size.toUpperCase()}) × {product.quantity}</p>
                          </div>
                          <div className="text-right font-semibold md:justify-self-end">
                            ₹{product.currentPrice.toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Shipping</span>
                          <span className="font-semibold">₹0.00</span>
                        </div>
                        {/* <div className="flex items-center justify-between">
                          <span>Tax</span>
                          <span className="font-semibold">$25.00</span>
                        </div> */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">Total</span>
                          <span className="text-2xl font-bold">₹{(order.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-6 grid gap-4">
                  <h2 className="text-2xl font-bold">Customer Information</h2>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Customer</span>
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <a href={`tel:${order.contactNumber}`}>{order.contactNumber}</a>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-semibold">Shipping Address</div>
                      <address className="not-italic text-muted-foreground">
                        <span>{order.customerName}</span>
                        <br />
                        <span>{order.address.street}</span>
                        <br />
                        <span>{order.address.city}, {order.address.state} {order.address.pincode}</span>
                      </address>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-semibold">Billing Address</div>
                      <div className="text-muted-foreground">Same as shipping address</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-between">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Continue shopping
            </Link>
            {/* <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <TruckIcon className="w-4 h-4 mr-2" />
                Track Order
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 w-10">
                    <MoveVerticalIcon className="w-4 h-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Export</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Trash</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div> */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}