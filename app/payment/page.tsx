"use client";
import CheckoutPage from "./module/CheckoutPage";
import convertToSubcurrency from "@/app/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);
const amount = convertToSubcurrency(19.99); // $19.99
export default function PaymentPage() {
  return (
    <main>
      <div>
        <h1>User</h1>
        <h2>
          Has Requested <span>${amount}</span>
        </h2>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        {" "}
        <CheckoutPage amount={amount} />
      </Elements>
    </main>
  );
}
