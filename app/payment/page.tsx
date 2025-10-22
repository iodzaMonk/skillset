"use client";
import CheckoutPage from "./module/CheckoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const amount = 19.99; // $19.99

export default function PaymentPage() {
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
                  Professional Service
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${amount.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ${amount.toFixed(2)}
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
            <Elements
              stripe={stripePromise}
              options={{
                mode: "payment",
                amount: convertToSubcurrency(amount),
                currency: "usd",
              }}
            >
              <CheckoutPage amount={amount} />
            </Elements>
          </div>
        </div>
      </div>
    </main>
  );
}
