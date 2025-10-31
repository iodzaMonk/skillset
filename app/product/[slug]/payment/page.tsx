"use client";
import CheckoutPage from "./module/CheckoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";

import type { PostBody } from "@/types/PostBody";
import { useAuth } from "@/app/context/AuthContext";

import type { PostBody } from "@/types/PostBody";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

interface Order {
  prof_id: string;
  product_id: string;
  description: string;
  client_id: string;
}

export default function PaymentPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order>({
    prof_id: "",
    product_id: slug ?? "",
    description: "",
    client_id: "",
  });

  const [product, setProduct] = useState<PostBody | null>(null);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  const fetchProduct = async (productSlug: string) => {
    try {
      const response = await axios.get(`/api/product/${productSlug}`);
      const productData = response.data;
      setProduct(productData);
      setAmount(productData.price || 0);
      return productData;
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get order details from URL parameters
    const description = searchParams?.get("description") ?? "";
    const prof_id = searchParams?.get("prof_id") ?? "";
    const productId = searchParams?.get("productId") ?? slug ?? "";
    const userId = searchParams?.get("userId") ?? user?.id ?? "";

    // Set order state with all required fields
    setOrder({
      prof_id,
      product_id: productId,
      description,
      client_id: userId,
    });

    // Fetch product data if we have a slug
    if (slug) {
      fetchProduct(slug);
    }
  }, [searchParams, slug, user?.id]);

  // Show error state
  if (error) {
    return (
      <main className="border-border bg-surface/90 m-5 mx-auto max-w-4xl overflow-hidden rounded-lg p-10 shadow-lg">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-red-600">
            <h1 className="mb-4 text-2xl font-bold">Error</h1>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="border-border bg-surface/90 m-5 mx-auto max-w-4xl overflow-hidden rounded-lg p-10 shadow-lg">
      <div className="mx-auto max-w-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-accent mb-2 text-3xl font-bold">
            Complete Your Payment
          </h1>
          <p className="text-accent">Secure checkout powered by Stripe</p>
        </div>

        {/* Payment Summary */}
        <div className="mb-8 overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Payment Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Service Request</p>
                <p className="font-medium text-gray-900">
                  {loading
                    ? "Loading..."
                    : product?.title ||
                      order.description ||
                      "Professional Service"}
                </p>
                {product?.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {product.description}
                  </p>
                )}
                {order.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Order Details:</strong> {order.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {loading ? "Loading..." : `$${amount.toFixed(2)}`}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {loading ? "Loading..." : `$${amount.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Payment Details
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                  <p className="text-gray-600">Loading payment details...</p>
                </div>
              </div>
            ) : amount > 0 ? (
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: convertToSubcurrency(amount),
                  currency: "usd",
                }}
              >
                <CheckoutPage amount={amount} order={order} />
              </Elements>
            ) : (
              <div className="py-8 text-center">
                <p className="text-red-600">
                  Invalid amount. Please try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
