"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

async function getProducts() {
  const response = await axios.get("/api/product");
  return response.data;
}

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  owner?: {
    full_name?: string;
  };
};

export default function Page() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-text mb-6 text-3xl font-bold">Products</h1>
      {products === null ? (
        <p className="text-text-muted">No products yet.</p>
      ) : (
        <Carousel
          className="w-full"
          opts={{ align: "start", slidesToScroll: 2, containScroll: "trimSnaps", loop: true }}
          plugins={[Autoplay({ delay: 20000000 })]}
        >
          <CarouselContent className="-ml-2">
            {products!.map((p) => (
              <CarouselItem
                key={p.id}
                className="pl-2 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="aspect-video rounded-lg border border-border/15 bg-surface p-4">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-text text-lg font-semibold">{p.title}</h2>
                    <span className="text-accent font-semibold">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>

                  {p.description && (
                    <p className="text-text-muted mt-2 text-sm line-clamp-3">
                      {p.description}
                    </p>
                  )}

                  {p.owner?.full_name && (
                    <p className="text-text-muted mt-3 text-xs">by {p.owner.full_name}</p>
                  )}

                  <Link href={`/product/${p.id}`} className="mt-3 inline-block text-blue-600">
                    View details
                  </Link>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>)
      }
    </main >
  );
}
