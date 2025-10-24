"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PostBody } from "@/types/PostBody";

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

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
            <div className="border-border/60 bg-surface/90 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm">
              <div className="bg-muted/60 relative h-52 w-full">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : product.image_location ? (
                  <div className="text-text-muted flex h-full w-full items-center justify-center text-xs font-medium tracking-wide uppercase">
                    Image stored at {product.image_location}
                  </div>
                ) : (
                  <div className="text-text-muted flex h-full w-full items-center justify-center text-xs font-medium tracking-wide uppercase">
                    No image uploaded
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h2 className="text-text line-clamp-2 text-lg font-semibold">
                  {product.title}
                </h2>
                {product.description && (
                  <p className="text-text-muted line-clamp-3 text-sm leading-6">
                    {product.description}
                  </p>
                )}
                {product.category && <p>{product.category}</p>}
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-accent text-xl font-semibold">
                    {currencyFormatter.format(product.price)}
                  </span>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-success hover:text-success/80 text-sm font-medium"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export default ProductCarousel;
