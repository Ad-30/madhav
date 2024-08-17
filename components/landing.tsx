"use client"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { CategoryCard } from "./ui/category-card"
import LandingCarousel from "./ui/carousel-landing"
export function Landing() {
  const categoryCardArray = [
    { src: "https://res.cloudinary.com/dvnv7ruzv/image/upload/v1723369913/category-image-poshak.jpg", alt: "Poshaks", heading: "Poshaks", description: "Discover our exquisite collection of traditional dresses.", link: "/category?category=Poshak" },
    { src: "https://res.cloudinary.com/dvnv7ruzv/image/upload/v1723370371/category-image-accessories.jpg", alt: "Accessories", heading: "Accessories", description: "Explore our collection of sacred puja items for your home.", link: "/category?category=Accessories" },
    { src: "https://res.cloudinary.com/dvnv7ruzv/image/upload/v1723370371/category-image-accessories.jpg", alt: "Puja Items", heading: "Puja Items", description: "Elevate your puja experience with our carefully curated accessories.", link: "/category?category=Puja Items" }
  ];
  const banners = [
    {
      url: "https://flowbite.com/docs/images/carousel/carousel-1.svg",
      alt: "Carousel image 1"
    },
    {
      url: "https://flowbite.com/docs/images/carousel/carousel-2.svg",
      alt: "Carousel image 2"
    },
    {
      url: "https://flowbite.com/docs/images/carousel/carousel-3.svg",
      alt: "Carousel image 3"
    },
    {
      url: "https://flowbite.com/docs/images/carousel/carousel-4.svg",
      alt: "Carousel image 3"
    }
  ];
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* <section className="bg-[url('/hero-image.jpg')] bg-cover bg-center h-[400px] md:h-[500px] flex items-center justify-center"> */}
        {/* <div className="bg-background/80 backdrop-blur-sm p-6 md:p-10 text-center max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Elevate Your Puja Experience</h1>
            <p className="text-muted-foreground mb-6">
              Discover our exquisite collection of puja items and traditional dresses, crafted with care and elegance.
            </p>
            <Link
              href="#explore"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              Shop Now
            </Link>
          </div> */}

        {/* </section> */}
        <section className="py-12">
          <div className="w-full mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Featured Products</h2>
          </div>
          <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="w-full">
              <LandingCarousel banners={banners} autoplayInterval={5000} />
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16" id="explore">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore Our Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categoryCardArray.map((category, index) => (
                <CategoryCard
                  key={index}
                  src={category.src}
                  alt={category.alt}
                  heading={category.heading}
                  description={category.description}
                  link={category.link}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

