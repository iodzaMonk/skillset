import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function ConnectStripeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleConnect = async () => {
    if (!user?.email) {
      setError("Please log in to connect your Stripe account");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/user/create-stripe-account", {
        email: user.email,
        refreshUrl: `${window.location.origin}`,
        returnUrl: `${window.location.origin}`,
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error connecting to Stripe:", error);
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to connect to Stripe")
        : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!user?.vendor_id ? (
        <div className="space-y-2">
          <Button
            onClick={handleConnect}
            disabled={loading || !user}
            variant="default"
            className="w-full"
          >
            {loading ? "Connecting..." : "Connect to Stripe"}
          </Button>
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Your Stripe account is already connected.
          </p>
        </div>
      )}
    </div>
  );
}
