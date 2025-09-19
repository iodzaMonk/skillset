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
import { id } from "zod/v4/locales";
const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition resize-none";

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
    console.log(product);
  }, [user?.id]);

  async function onclick(id: Key) {
    axios
      .delete("/api/product", { data: { id: id } })
      .then((res) => {
        console.log(res);
        router.refresh();
      })
      .catch((err) => console.error("Failed to delete product", err));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("Submitting form...");
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload = {
      user_id: user?.id,
      title: form.get("service_name"),
      description: form.get("service_description"),
      price: parseFloat(form.get("service_price")?.toString() || "0"),
    };

    try {
      const response = await axios.post("/api/product/user", payload);
      console.log(response);
      if (response.status === 200) {
        setOpen(false);
        router.push("/myproduct");
        console.log("Product added successfully:", response.data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  return (
    <main className="c mx-auto max-w-4xl p-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-accent/10 hover:bg-accent/20 mb-4"
          >
            Add a good/service
          </Button>
        </DialogTrigger>
        <h1>My Products</h1>

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
                className="hover:bg-text-muted/20 border-1"
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-button-create/60 hover:bg-button-create/70 border-1"
              >
                Create
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {product === null ? (
        <p className="text-text-muted">No products yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {product.map(
            (p: {
              id: number | Key;
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
                <button
                  type="button"
                  onClick={() => onclick(p.id)}
                  className="inline-flex items-center rounded-lg border border-red-600 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-red-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg
                    className="mr-1 -ml-1 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Delete
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
