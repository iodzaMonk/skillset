"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PostBody } from "@/types/PostBody";
import { ProductCard } from "./ProductCard";

async function getProducts(): Promise<PostBody[]> {
  const response = await axios.get<PostBody[]>("/api/product");
  return response.data;
}

export function ProductCarousel() {
  const [products, setProducts] = useState<PostBody[] | null>(null);

  useEffect(() => {
    setProducts(null);
    void getProducts().then(setProducts);
  }, []);

  if (products === null) {
    return <p className="text-text-muted">Loading products…</p>;
  }

  if (products.length === 0) {
    return <p className="text-text-muted">No products yet.</p>;
  }

  return (
    <Carousel
      className="w-full"
      opts={{
        align: "start",
        slidesToScroll: 2,
        containScroll: "trimSnaps",
        loop: true,
      }}
      plugins={[Autoplay({ delay: 10000 })]}
    >
      <CarouselContent className="-ml-2">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-full pl-2 md:basis-1/2 lg:basis-1/3"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ProductCarousel;
