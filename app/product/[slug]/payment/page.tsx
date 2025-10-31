"use client";
import CheckoutPage from "./module/CheckoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

import type { PostBody } from "@/types/PostBody";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

export default function PaymentPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();

  const [order, setOrder] = useState({
    prof_id: "",
    product_id: slug ?? "",
    description: "",
    client_id: "",
  });

  const [product, setProduct] = useState<PostBody | null>(null);
  const [amount, setAmount] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  const fetchProduct = async (slug: string) => {
    try {
      const response = await axios.get(`/api/product/${slug}`);
      setProduct(response.data);
      setAmount(response.data.price);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const description = searchParams?.get("description") ?? "";
    const prof_id = searchParams?.get("prof_id") ?? "";
    const product_id = searchParams?.get("productId") ?? slug ?? "";
    const client_id = searchParams?.get("userId") ?? "";

    setOrder({
      prof_id,
      product_id,
      description,
      client_id,
    });

    // Actually call fetchProduct
    if (slug) {
      fetchProduct(slug);
    }
  }, [searchParams, slug]);

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
                  {product?.title ||
                    order.description ||
                    "Professional Service"}
                </p>
                {product?.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {product.description}
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

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Payment Details
            </h3>
            {!loading && (
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
            )}
            {loading && (
              <div className="py-8 text-center">
                <p>Loading payment details...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
