"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
              <div className="mb-5 flex flex-wrap items-center gap-5">
                <h1 className="text-text text-3xl font-bold">
                  {product.title}
                </h1>

                <div className="flex items-center text-sm">
                  <svg
                    className={`me-1 h-4 w-4 ${product.ratingCount && product.ratingCount > 0 ? "text-yellow-300" : "text-text-muted"}`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill={product.ratingCount && product.ratingCount > 0 ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  {product.ratingCount && product.ratingCount > 0 ? (
                    <>
                      <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">
                        {product.rating?.toFixed(2)}
                      </p>
                      <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400"></span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.ratingCount} review{product.ratingCount === 1 ? "" : "s"}
                      </span>
                    </>
                  ) : (
                    <span className="text-text-muted text-sm">No ratings yet</span>
                  )}
                </div>
                {product.users ? (
                  <div className="text-text-muted flex flex-col text-xs sm:text-sm">
                    <span>
                      by{" "}
                      <Link
                        href={`/professional/${product.users.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {product.users.name}
                      </Link>
                    </span>
                    {product.users.country ? (
                      <span className="text-text-muted/80">
                        Based in {product.users.country}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

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
