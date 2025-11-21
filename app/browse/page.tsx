"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PostBody } from "@/types/PostBody";
import { Category } from "@/types/Category";
import { CategorySelectEnum } from "./components/categories";

async function getProducts(category?: Category | null): Promise<PostBody[]> {
  const response = await axios.get<PostBody[]>("/api/product", {
    params: category ? { category } : undefined,
  });
  return response.data;
}

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function Page() {
  const [products, setProducts] = useState<PostBody[] | null>(null);
  const [val, setVal] = useState<Category | null>(null);

  useEffect(() => {
    setProducts(null);
    void getProducts(val).then(setProducts);
  }, [val]);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-text mb-6 text-3xl font-bold">Products</h1>
      <CategorySelectEnum
        enumObj={Category}
        value={val}
        onChange={setVal}
        allowClear
      />
      {products === null ? (
        <p className="text-text-muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="text-text-muted">No products yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="border-border/60 bg-surface/90 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm"
            >
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
          ))}
        </div>
      )}
    </main>
  );
}
