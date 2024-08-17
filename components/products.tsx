import Link from "next/link";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ProductCard } from "./ui/productCard";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { getProducts } from "@/actions/getProducts";
import { useInView } from 'react-intersection-observer';
import { Spinner } from "./ui/spinner";
import BlurFade from "@/components/magicui/blur-fade";

interface Product {
  src: string;
  id: string;
  name: string;
  category: string;
  price: string;
  totalStock: string;
  alt: string;
}

interface ProductsProps {
  products: Product[];
  totalItems: number;
}

export function Products({ products, totalItems }: ProductsProps) {
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(products);
  const [offset, setOffset] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
    poshak: false,
    accessories: false,
    pujaItems: false,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Poshak';

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  const fetchAllProducts = async () => {
    if (isFetching || offset > totalItems) return;

    setIsFetching(true);
    try {
      const response = await getProducts({ offset, limit: 16, category });
      if (response.data.length === 0) {
        setOffset(totalItems); // Prevent further fetches if no data
      } else {
        setAllProducts(prevProducts => [...prevProducts, ...response.data]);
        setDisplayedProducts(prevProducts => [...prevProducts, ...response.data]);
        setOffset(prevOffset => prevOffset + 16);
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const applyFiltersAndSearch = async () => {
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

      setDisplayedProducts(filteredProducts);
    };

    applyFiltersAndSearch();
  }, [filters, searchTerm, allProducts]);

  useEffect(() => {
    if (inView) {
      fetchAllProducts();
    }
  }, [inView]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">{category}</h1>
          </div>
        </section>
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 lg:gap-6">
              {displayedProducts.map((product, index) => (
                <BlurFade key={product.id} delay={0.25 + index * 0.05} inView>
                  <Link href={`/product?id=${product.id}`}>
                    <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} alt={product.alt} src={product.src} />
                  </Link>
                </BlurFade>
              ))}
            </div>
            {isFetching && <Spinner className="text-black" size="large" />}
            <div ref={ref} className="h-16"></div> {/* Sentinel element */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}