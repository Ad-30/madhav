"use client"
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image"
import { FilterIcon } from "./ui/icons"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { EditProduct } from './edit-product';

interface Product {
  src: string;
  id?: string;
  name: string;
  category: string;
  price: string;
  totalStock: string;
}
export function Inventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState("");

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const openDialog = (productId: string) => {
    setSelectedProductId(productId);
    setIsDialogOpen(true);
  };

  const openAlertDialog = (productId: string) => {
    setSelectedProductId(productId);
    setIsAlertDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedProductId(null);
  };

  const closeAlertDialog = () => {
    setIsAlertDialogOpen(false);
    setSelectedProductId(null);
  };

  const fetchAllProducts = async (page: number) => {
    try {
      const response = await axios.get(`/api/sellerproduct/?page=${page}&itemsPerPage=16`);
      const products: Product[] = response.data.data;
      setAllProducts(products);
      setTotalPages(response.data.pagination.totalPages);
      setCurrentPage(response.data.pagination.currentPage);
      setProducts(products);
      // console.log(currentPage, totalPages);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  useEffect(() => {

    fetchAllProducts(currentPage);
  }, [currentPage, totalPages]);
  const [products, setProducts] = useState(allProducts);
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
    poshak: false,
    accessories: false,
    pujaItems: false,
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const applyFiltersAndSearch = () => {
      let filteredProducts = [...allProducts];

      if (filters.inStock || filters.outOfStock) {
        filteredProducts = filteredProducts.filter(p => {
          const isInStock = parseInt(p.totalStock) > 0;
          return (filters.inStock && isInStock) || (filters.outOfStock && !isInStock) || (!filters.inStock && !filters.outOfStock);
        });
      }

      if (filters.poshak || filters.accessories || filters.pujaItems) {
        filteredProducts = filteredProducts.filter(p => {
          const categoryMatch = (filters.poshak && p.category === 'Poshak') ||
            (filters.accessories && p.category === 'Accessories') ||
            (filters.pujaItems && p.category === 'Puja Items');
          return categoryMatch || (!filters.poshak && !filters.accessories && !filters.pujaItems);
        });
      }

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(filteredProducts);
    };

    applyFiltersAndSearch();
  }, [filters, searchTerm]);

  const handleFilterChange = (filter: string, value: boolean) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchAllProducts(page);
    }
  };
  return (
    <div className="flex flex-col min-h-screen w-full">
      <main className="flex-1 pb-11">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid gap-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Inventory Management</h2>
              <Button size="sm">Add New Product</Button>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search products..."
                  className="bg-white dark:bg-gray-950 flex-1"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FilterIcon className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.inStock}
                      onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                    >
                      In Stock
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.outOfStock}
                      onCheckedChange={(checked) => handleFilterChange('outOfStock', checked)}
                    >
                      Out of Stock
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={filters.poshak}
                      onCheckedChange={(checked) => handleFilterChange('poshak', checked)}
                    >
                      Poshak
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.accessories}
                      onCheckedChange={(checked) => handleFilterChange('accessories', checked)}
                    >
                      Accessories
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filters.pujaItems}
                      onCheckedChange={(checked) => handleFilterChange('pujaItems', checked)}
                    >
                      Puja Items
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {products.map((product, index) => (
                  <div key={index} className="bg-muted border rounded-lg overflow-hidden shadow-lg bg-white" >
                    <Image
                      src={product.src}
                      alt="Product Image"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                      style={{ objectFit: "contain" }}
                    />

                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">₹{product.price}</span>
                        <span className="text-sm text-muted-foreground">In Stock: {product.totalStock}</span>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => openDialog(product.id)} variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button onClick={() => openAlertDialog(product.id)} variant="outline" size="sm" color="red">
                          Delete
                        </Button>
                      </div>

                    </div>
                  </div>
                ))}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogContent className="max-h-screen overflow-y-auto">
                    <DialogTitle>
                      Edit Product
                    </DialogTitle>
                    <div className="p-4">
                      {/* Fetch and pass the product details based on the selectedProductId */}
                      {selectedProductId && <EditProduct productId={selectedProductId} />}
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={closeDialog}>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* AlertDialog for deleting product */}
                <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the product and remove its data from the server.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={closeAlertDialog}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={closeAlertDialog}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                }
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={
                  currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                }
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main >

    </div >
  )
}
