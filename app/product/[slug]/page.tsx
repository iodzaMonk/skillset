"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

async function fetchProduct(slug: string) {
  const response = await axios.get(`/api/product/${slug}`);
  return response.data;
}

type Product = {
  title: string;
  description: string;
  price: number;
};

export default function ProductPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    fetchProduct(slug)
      .then(setProduct)
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product");
      });
  }, [slug]);

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-error bg-error/10 rounded-md px-4 py-2">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] p-6">
      {product ? (
        <div className="border-border bg-surface/90 mx-auto max-w-4xl overflow-hidden rounded-lg border shadow-lg">
          <div className="p-6">
            <h1 className="text-text mb-6 text-3xl font-bold">
              {product.title}
            </h1>

            <div className="flex flex-col gap-8 md:flex-row">
              <div className="relative min-h-[300px] w-full md:w-1/2">
                <Image
                  src="/storage/temp.jpg"
                  alt={product.title}
                  fill
                  className="border-object-cover"
                  priority
                />
              </div>

              <div className="flex w-full flex-col justify-between md:w-1/2">
                <div className="space-y-4">
                  <p className="text-text-muted text-lg leading-relaxed">
                    {product.description}
                  </p>
                  <div className="text-accent text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    className="bg-primary hover:bg-primary/90 flex-1 rounded-lg px-6 py-3 text-white transition-colors"
                    onClick={() => {
                      /* Add order handling */
                    }}
                  >
                    Order Now
                  </button>
                  <button
                    className="border-border hover:bg-surface flex-1 rounded-lg border px-6 py-3 transition-colors"
                    onClick={() => router.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-text-muted">Loading...</div>
        </div>
      )}
    </div>
  );
}
