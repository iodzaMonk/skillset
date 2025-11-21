"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { PostBody } from "@/types/PostBody";
import { Category } from "@/types/Category";
import { CategorySelectEnum } from "./components/categories";
import ProductCard from "@/app/_components/ProductCard";

async function getProducts(category?: Category | null): Promise<PostBody[]> {
  const response = await axios.get<PostBody[]>("/api/product", {
    params: category ? { category } : undefined,
  });
  return response.data;
}

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
