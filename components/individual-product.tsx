"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import Cookie from 'js-cookie';
import { Spinner } from "@/components/ui/spinner";
import { useCart } from "@/contexts/CartContext";
import { ProductProps } from "@/props/ProductProps";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";



interface CartCookieItem {
  productId: string;
  size: string;
  quantity: string;
}

interface ProductState {
  product: ProductProps;
}

export function IndividualProduct({ product }: ProductState) {
  const [productDisplay, setProductDisplay] = useState<ProductProps>(product);
  const [selectedSize, setSelectedSize] = useState<string>("m");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("1");
  const [quantityOptions, setQuantityOptions] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { updateCart } = useCart();

  useEffect(() => {
    const stockLevel = product.stockLevels[selectedSize.toUpperCase()];
    const newOptions = stockLevel ? Array.from({ length: stockLevel }, (_, i) => i + 1) : [];
    setQuantityOptions(newOptions);
    setSelectedQuantity(newOptions.length > 0 ? '1' : '');
    setIsDisabled(newOptions.length === 0);
  }, [selectedSize, product.stockLevels]);

  useEffect(() => {
    setProductDisplay(product);
  }, [product]);

  const handleAddToCart = () => {
    setIsAddingToCart(true);

    const cartItem: CartCookieItem = {
      productId: productDisplay.productId,
      size: selectedSize,
      quantity: selectedQuantity,
    };

    const existingCart = Cookie.get('cart');
    let cart: CartCookieItem[] = existingCart ? JSON.parse(existingCart) : [];
    const cartProductItemId: string = productDisplay.productId;
    const checkIfIdAndSizeExists = (existingCart: CartCookieItem[], idToCheck: string, sizeToCheck: string): boolean => {
      return existingCart.some(item => item.productId === idToCheck && item.size === sizeToCheck);
    };
    if (checkIfIdAndSizeExists(cart, cartProductItemId, selectedSize)) {
      const index = cart.findIndex(item => item.productId === cartProductItemId);
      cart[index].quantity = String(parseInt(cart[index].quantity) + parseInt(selectedQuantity));
    } else {
      cart.push(cartItem);
    }
    Cookie.set('cart', JSON.stringify(cart));

    updateCart();

    toast({
      title: 'Added to Cart',
      description: `${productDisplay.name} (${selectedSize}) x ${selectedQuantity} added to cart.`,
      duration: 2000,
      variant: "success",
    });

    setIsAddingToCart(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 min-h-screen">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div>
            <Carousel
              className="rounded-lg overflow-hidden"
              opts={{ loop: true }}
              autoplay={false}
              autoplayInterval={5000}
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: "600/600", objectFit: "contain" }}
                      priority
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {product.images.length > 1 && (
                <>
                  <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 bg-background/50 hover:bg-background/75 rounded-full p-2 cursor-pointer z-10 transition-colors">
                    <ChevronLeftIcon className="w-6 h-6 text-muted-foreground" />
                  </CarouselPrevious>
                  <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 bg-background/50 hover:bg-background/75 rounded-full p-2 cursor-pointer z-10 transition-colors">
                    <ChevronRightIcon className="w-6 h-6 text-muted-foreground" />
                  </CarouselNext>
                </>
              )}
            </Carousel>
          </div>
          <div className="grid gap-4 w-full">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            {/* Display price based on the selected size */}
            <p className="text-2xl font-bold text-black">₹{product.priceLevels[selectedSize.toUpperCase()]}</p>
            <div className="grid gap-2">
              <div className="max-w-xs md:max-w-xs lg:max-w-lg">
                <div className="break-words">{product.description}</div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size">Size</Label>
              <RadioGroup
                id="size"
                defaultValue="m"
                className="flex items-center gap-2"
                onValueChange={(value) => setSelectedSize(value)}
              >
                {Object.keys(product.stockLevels).map((size) => (
                  <Label
                    key={size}
                    htmlFor={`size-${size.toLowerCase()}`}
                    className={`border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted ${product.stockLevels[size] === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <RadioGroupItem
                      id={`size-${size.toLowerCase()}`}
                      value={size.toLowerCase()}
                      disabled={product.stockLevels[size] === 0}
                    />
                    {size}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Select
                defaultValue="1"
                onValueChange={(value) => setSelectedQuantity(value)}
                disabled={isDisabled}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {quantityOptions.map((qty) => (
                    <SelectItem key={qty} value={String(qty)}>
                      {qty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isAddingToCart ? (
              <Button size="lg" disabled={true}>
                <Spinner className="text-black" size="large" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleAddToCart} disabled={isDisabled}>
                {isDisabled ? 'Out of stock!' : 'Add to Cart'}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}