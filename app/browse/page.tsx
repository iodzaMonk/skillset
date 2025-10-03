import axios from "axios";
import { useEffect, useState } from "react";

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
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products!.map((p) => (
            <li
              key={p.id}
              className="border-border bg-surface rounded-lg border p-4"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-text text-lg font-semibold">{p.title}</h2>
                <span className="text-accent font-semibold">
                  ${p.price.toFixed(2)}
                </span>
              </div>
              {p.description && (
                <p className="text-text-muted mt-2 text-sm">{p.description}</p>
              )}
              {p.owner?.full_name && (
                <p className="text-text-muted mt-3 text-xs">
                  by {p.owner.full_name}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
