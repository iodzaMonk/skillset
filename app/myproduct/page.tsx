"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../context/AuthContext";
const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";
const hintText = "text-sm text-text-muted";

export default function MyProducts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<
    { id: Key; title: string; price: number; description: string }[] | null
  >(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get("/api/product/user")
      .then((res) => setProduct(res.data.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, [user?.id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("Submitting form...");
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload = {
      user_id: user?.id,
      name: form.get("service_name"),
      description: form.get("service_description"),
      price: form.get("service_price"),
    };
    try {
      const response = await axios.post("/api/product/user", payload);
      console.log(response);
      if (response.status === 200) {
        setOpen(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  return (
    <main className="mx-auto max-w-4xl p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className={labelBase}>
            Add a good/service
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-surface sm:max-w-[425px]">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle className={labelBase}>
                Add a good/service
              </DialogTitle>
              <DialogDescription className={hintText}>
                Fill in the details of the good/service you want to add.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <br />
              <div className="grid gap-3">
                <Label htmlFor="service_name" className={labelBase}>
                  Title
                </Label>
                <Input
                  id="service_name"
                  name="service_name"
                  placeholder="Title"
                  className={inputBase}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="service_description" className={labelBase}>
                  Description
                </Label>
                <textarea
                  id="service_description"
                  name="service_description"
                  placeholder="Description"
                  className={inputBase}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="service_price" className={labelBase}>
                  Price
                </Label>
                <input
                  className={inputBase}
                  type="number"
                  step="0.01"
                  min="0"
                  id="service_price"
                  name="service_price"
                  placeholder="Price"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                className={labelBase}
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <h1>My Products</h1>
      {product === null ? (
        <p className="text-text-muted">No products yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {product.map(
            (p: {
              id: Key;
              title: string;
              price: number;
              description: string;
            }) => (
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
                  <p className="text-text-muted mt-2 text-sm">
                    {p.description}
                  </p>
                )}
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
