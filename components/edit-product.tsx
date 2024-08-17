
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { XIcon, PlusIcon } from "@/components/ui/icons";
import { getIndividualProduct } from "@/actions/getIndividualProduct"
import { useEffect, useState } from "react"
import { ProductProps } from "@/props/ProductProps"
import { useScroll } from "framer-motion"
interface ProductIdProps {
  productId: string
}

export function EditProduct({ productId }: ProductIdProps) {
  const [product, setProduct] = useState<ProductProps>();
  const fetchProductDetails = async () => {
    const response = await getIndividualProduct({ id: productId })
    setProduct(response.data);
    console.log(response.data);
  }

  const handleRemoveImage = (index: number) => {
    if (!product) return;
    const newImages = product?.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };
  useEffect(() => {
    fetchProductDetails()
  }, [productId])
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8">
            {/* <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Update Product</h2>
            </div> */}
            <form className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" type="text" defaultValue="Product" value={product?.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea id="description" defaultValue="A beautiful puja thali for your daily worship." value={product?.description} />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" defaultValue="24.99" />
              </div> */}
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="puja-items" value={product?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
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
                  {product?.images.map((image, index) =>
                    <div key={index} className="relative group">
                      <img
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
              <div className="grid gap-2">
                <Label>Available Sizes</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox name="sizes" value="xs" defaultChecked />
                    XS
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox name="sizes" value="s" defaultChecked />
                    S
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox name="sizes" value="m" defaultChecked />
                    M
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox name="sizes" value="l" />
                    L
                  </Label>
                  <Label className="flex items-center gap-2 font-normal">
                    <Checkbox name="sizes" value="xl" />
                    XL
                  </Label>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Stock Levels</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="stock-xs">XS</Label>
                    <Input id="stock-xs" type="number" defaultValue="5" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock-s">S</Label>
                    <Input id="stock-s" type="number" defaultValue="10" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock-m">M</Label>
                    <Input id="stock-m" type="number" defaultValue="15" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock-l">L</Label>
                    <Input id="stock-l" type="number" defaultValue="8" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock-xl">XL</Label>
                    <Input id="stock-xl" type="number" defaultValue="3" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {/* <Button variant="outline">Cancel</Button> */}
                <Button>Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

