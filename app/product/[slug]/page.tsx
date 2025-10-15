"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      {product ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-gray-600">{product.description}</p>
          <span className="text-xl font-semibold">
            ${product.price.toFixed(2)}
          </span>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
