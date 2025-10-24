"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import Modal from "./components/Modal";
import Comments from "./components/Comments";
import { PostBody } from "@/types/PostBody";

async function fetchProduct(slug: string) {
  const response = await axios.get(`/api/product/${slug}`);
  return response.data;
}

interface OrderState {
  description: string;
  isSubmitting: boolean;
  error: string | null;
}

export default function ProductPage() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<PostBody | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderState, setOrderState] = useState<OrderState>({
    description: "",
    isSubmitting: false,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;

    fetchProduct(slug)
      .then(setProduct)
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product");
      });
  }, [slug]);

  const handleOrder = useCallback(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setIsDialogOpen(true);
  }, [user, router]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setOrderState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      if (product) {
        const order = {
          prof_id: product.user_id,
          productId: slug,
          description: orderState.description,
          userId: user?.id,
        };

        if (order.userId)
          router.push(
            `/product/${slug}/payment?description=` +
              encodeURIComponent(order.description) +
              `&prof_id=` +
              encodeURIComponent(order.prof_id) +
              `&productId=` +
              encodeURIComponent(order.productId) +
              `&userId=` +
              encodeURIComponent(order.userId),
          );

        setIsDialogOpen(false);
        setOrderState((prev) => ({ ...prev, description: "" }));
      }
    } catch (err) {
      setOrderState((prev) => ({
        ...prev,
        error: axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to submit order")
          : "An unexpected error occurred",
      }));
    } finally {
      setOrderState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDescriptionChange = useCallback((value: string) => {
    setOrderState((prev) => ({ ...prev, description: value }));
  }, []);

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
        <>
          <div className="border-border bg-surface/90 mx-auto max-w-4xl overflow-hidden rounded-lg border shadow-lg">
            <div className="p-6">
              <h1 className="text-text mb-6 text-3xl font-bold">
                {product.title}
              </h1>

              <div className="flex flex-col gap-8 md:flex-row">
                <div className="relative min-h-[300px] w-full md:w-1/2">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      width={500}
                      height={500}
                      className="border-object-cover"
                      priority
                    />
                  )}
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
                      onClick={handleOrder}
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
            <Modal
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              description={orderState.description}
              onDescriptionChange={handleDescriptionChange}
              onSubmit={handleSubmitOrder}
              isSubmitting={orderState.isSubmitting}
              error={orderState.error}
              product={product}
            />
          </div>
        </>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-text-muted">Loading...</div>
        </div>
      )}
      {slug ? <Comments productId={slug} /> : null}
    </div>
  );
}
