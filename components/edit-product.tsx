import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { XIcon, PlusIcon } from "@/components/ui/icons";
import { getIndividualProduct } from "@/actions/getIndividualProduct";
import { useEffect, useState } from "react";
import { ProductProps } from "@/props/ProductProps";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "./ui/spinner";
import { updateProductById } from "@/actions/updateIndividualProduct";

interface ProductIdProps {
  productId: string;
}

export function EditProduct({ productId }: ProductIdProps) {
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductProps>({
    _id: '',
    productId: '',
    name: '',
    description: '',
    priceLevels: {},
    category: '',
    images: [],
    sizes: [],
    stockLevels: {},
    createdAt: '',
    updatedAt: '',
    __v: 0
  });

  const [fetchedImages, setFetchedImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  useEffect(() => {
    setFetchedImages(product.images);
  }, [product.images]);

  const fetchProductDetails = async () => {
    const response = await getIndividualProduct({ id: productId });
    setProduct(response.data);
  };

  const imageUrlArrayChange = (index: number) => {
    const newImagesLinksArray = [...fetchedImages];
    newImagesLinksArray.splice(index, 1);
    setFetchedImages(newImagesLinksArray);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  const handleConfirmChanges = async () => {
    setIsSaving(true);
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
        setIsSaving(false);
        return;
      }
    }
    const newData = {
      name: product.name,
      description: product.description,
      category: product.category,
      images: [...fetchedImages, ...imageUrls],
      sizes: product.sizes,
      stockLevels: product.stockLevels,
      priceLevels: product.priceLevels
    }
    const result = await updateProductById(productId, newData);
    if (result) {
      toast({
        // variant: "success",
        title: "Product updated successfully!",
        description: "Your changes have been saved.",
        duration: 2000,
      });
      console.log("Product updated successfully:", result);
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Try again",
        duration: 2000,
      });
      console.log("Failed to update product");
    }
    setIsSaving(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [id]: value
    }));
  };

  const handleStockLevelChange = (key: string, value: number) => {
    setProduct(prevProduct => {
      const newStockLevels = { ...prevProduct.stockLevels, [key]: value };
      return {
        ...prevProduct,
        stockLevels: newStockLevels
      };
    });

  };

  const handlePriceChange = (size: string, value: number) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      priceLevels: {
        ...prevProduct.priceLevels,
        [size]: value
      }
    }));

  };

  // Convert stockLevels object to array for rendering
  const stockLevelsArray = Object.entries(product.stockLevels);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" type="text" value={product.name} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea id="description" value={product.description} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={product.category} onValueChange={(value) => setProduct(prevProduct => ({ ...prevProduct, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={product.category || 'Select Category'} />
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
                {fetchedImages.map((image, index) =>
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt="Product Image"
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-md"
                      style={{ aspectRatio: "300/200", objectFit: "contain" }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={(event) => { event.preventDefault(); imageUrlArrayChange(index); }}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {previewImages.map((image, index) =>
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt="Product Image"
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-md"
                      style={{ aspectRatio: "300/200", objectFit: "contain" }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                      onClick={(event) => { event.preventDefault(); handleRemoveImage(index); }}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
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
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-7 gap-2">
                <Label className="text-muted-foreground">Sizes</Label>
                <Label className="text-muted-foreground w-full col-span-3">Stock Level</Label>
                <Label className="text-muted-foreground w-full col-span-3">Price</Label>
              </div>
              {stockLevelsArray.map(([size, level]) => (
                <div key={size} className="grid grid-cols-7 gap-2">
                  <Label htmlFor={`stock-${size.toLowerCase()}`} className="flex items-center">{size}</Label>
                  <Input
                    id={`stock-${size.toLowerCase()}`}
                    type="number"
                    value={level}
                    onChange={(e) => handleStockLevelChange(size, parseFloat(e.target.value))}
                    className="w-full col-span-3"
                  />
                  <Input
                    type="number"
                    placeholder={`Price (${size})`}
                    value={product.priceLevels[size] || 0}
                    onChange={(e) => handlePriceChange(size, parseFloat(e.target.value))}
                    className="w-full col-span-3"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              {isSaving ? <Button onClick={handleConfirmChanges} disabled><Spinner size="medium" className="text-black" /></Button> : <Button onClick={handleConfirmChanges}>Save Changes</Button>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}