import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { XIcon, PlusIcon } from "@/components/ui/icons";
import Image from "next/image";
import axios, { isCancel, AxiosError } from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { Spinner } from "./ui/spinner";

function AddProduct() {
  const { toast } = useToast()
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockLevels, setStockLevels] = useState<{ [key: string]: number }>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });

  const [priceLevels, setPriceLevels] = useState<{ [key: string]: number }>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const handlePriceChange = (size: string, value: number) => {
    setPriceLevels(prevPriceLevels => ({ ...prevPriceLevels, [size]: value }));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleStockChange = (size: string, value: number) => {
    setStockLevels(prevStockLevels => ({ ...prevStockLevels, [size]: value }));
  };

  const handleSaveItem = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!productName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Product name is required.",
      });
      return;
    }

    if (!productDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Product description is required.",
      });
      return;
    }
    const validCategories = ["Poshak", "Puja Items", "Accessories"];
    if (!validCategories.includes(productCategory)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Choose category of product.",
      });
      return;
    }

    // if (!productPrice || Number(productPrice) <= 0) {
    //   console.log(productPrice);
    //   toast({
    //     variant: "destructive",
    //     title: "Validation Error",
    //     description: "Product price is required and must be greater than zero.",
    //   });
    //   return;
    // }


    if (images.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "At least one product image is required.",
      });
      return;
    }
    setIsSubmitting(true);

    const imageUrls: string[] = [];
    for (const image of images) {
      try {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrls.push(uploadResponse.data.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was an issue uploading an image.",
        });
        return;
      }
    }

    const availableSizes = Object.keys(stockLevels).filter(size => stockLevels[size] > 0);

    try {
      const response = await axios.post('/api/sellerproduct', {
        productName: productName,
        productDescription: productDescription,
        priceLevels: priceLevels,
        productCategory: productCategory,
        availableSizes: availableSizes,
        stockLevels: stockLevels,
        images: imageUrls,
      });
      toast({
        // variant: "success",
        title: "Cheers!",
        description: "Sucessfully Added New Product.",
      })
      // console.log(response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
      // console.error('Error submitting form:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="grid gap-8">
        <h2 className="text-2xl font-bold">Add New Product</h2>
        <form className="grid gap-6" >
          <div className="grid gap-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="product-description">Product Description</Label>
            <Textarea
              id="product-description"
              placeholder="Enter product description"
              className="min-h-[100px]"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          {/* <div className="grid gap-2">
            <Label htmlFor="product-price">Price</Label>
            <Input
              id="product-price"
              type="number"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div> */}
          <div className="grid gap-2">
            <Label htmlFor="product-category">Category</Label>
            <Select
              value={productCategory}
              onValueChange={(value) => setProductCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poshak">Poshak</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Puja Items">Puja Items</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Product Images</Label>
            <div className="grid grid-cols-3 gap-4">
              {images.length > 0 ? previewImages.map((src, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={src}
                    alt={`Product Image ${index + 1}`}
                    width={100}
                    height={100}
                    className="rounded-md object-cover w-full aspect-square"
                    priority={false}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-background/50 rounded-full p-1 text-muted-foreground hover:bg-background opacity-100 transition-opacity opacity-0"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )) : (
                <div className="relative group">
                  <Image
                    src="/placeholder.svg"
                    alt="Product Image"
                    width={100}
                    height={100}
                    className="rounded-md object-cover w-full aspect-square"
                    priority={false}
                  />
                  <button className="absolute top-2 right-2 bg-background/50 rounded-full p-1 text-muted-foreground hover:bg-background group-hover:opacity-100 transition-opacity opacity-0">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <label className="w-100 h-100 bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                <PlusIcon className="w-6 h-6" />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
          <div className="grid gap-2">
            <h2>Sizes</h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-7 gap-2">
                <Label className="text-muted-foreground">Sizes</Label>
                <Label className="text-muted-foreground w-full col-span-3" >Stock Level</Label>
                <Label className="text-muted-foreground w-full col-span-3" >Price</Label>
              </div>
              {Object.keys(stockLevels).map(size => (
                <div key={size} className="grid grid-cols-7 gap-2">
                  <Label htmlFor={`stock-${size.toLowerCase()}`} className="flex items-center">{size}</Label>
                  <Input
                    id={`stock-${size.toLowerCase()}`}
                    type="number"
                    value={stockLevels[size]}
                    onChange={(e) => handleStockChange(size, Number(e.target.value))}
                    className="w-full col-span-3"
                  />
                  <Input
                    type="number"
                    placeholder={`Price (${size})`}
                    value={priceLevels[size]}
                    onChange={(e) => handlePriceChange(size, parseInt(e.target.value))}
                    className="w-full col-span-3"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            {isSubmitting ? <Button type="submit" className={`${isSubmitting ? 'cursor-not-allowed ' : ''}`} onClick={handleSaveItem}><Spinner size="medium" className="text-black" /></Button> : <Button type="submit" className={`${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={handleSaveItem}>Save Item</Button>}
            {/* <Button type="submit" className={`${isSubmitting ? 'cursor-not-allowed' : ''}`} onClick={handleSaveItem}>Save Item</Button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;