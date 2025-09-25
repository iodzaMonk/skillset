"use client";
import { Button } from "@/components/ui/button";
import { ButtonMain } from "../Components/Button";
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
import { set } from "zod";
const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition resize-none";

const labelBase = "mb-2 block text-sm font-medium text-text";
const hintText = "text-sm text-text-muted";

export default function MyProducts() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<Key | null>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [product, setProduct] = useState<
    { id: Key; title: string; price: number; description: string }[] | null
  >(null);
  const { user } = useAuth();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/product/user");
      setProduct(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  async function deleteProduct(id: Key) {
    axios
      .delete("/api/product", { data: { id: id } })
      .then((res) => {
        fetchProducts();
        router.refresh();
      })
      .catch((err) => console.error("Failed to delete product", err));
    setDeleteOpen(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("Submitting form...");
    e.preventDefault();

    const payload = {
      user_id: user?.id,
      title: name,
      description: description,
      price: parseFloat(price || "0"),
    };

    try {
      let response;
      if (editingId) {
        response = await axios.put("/api/product/user", {
          ...payload,
          id: editingId,
        });
      } else {
        response = await axios.post("/api/product/user", payload);
      }

      if (response.status === 200) {
        fetchProducts();
        setOpen(false);
        setName("");
        setDescription("");
        setPrice("");
        setEditingId(null);
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  function handleDialogClose() {
    if (open) {
      setOpen(false);
      setName("");
      setDescription("");
      setPrice("");
      setEditingId(null);
    } else {
      setOpen(true);
    }
  }
  function Modify(p: {
    id: number | Key;
    title: string;
    price: number;
    description: string;
  }) {
    setName(p.title);
    setDescription(p.description);
    setPrice(p.price.toString());
    setEditingId(p.id);
    setOpen(true);
  }
  return (
    <main className="c mx-auto max-w-4xl p-6">
      <Dialog open={open} onOpenChange={handleDialogClose}>
        {" "}
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
                  onChange={(e) => setName(e.target.value)}
                  value={name}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="service_price" className={labelBase}>
                  Price
                </Label>
                <input
                  className={inputBase}
                  value={price}
                  type="number"
                  step="0.01"
                  min="0"
                  id="service_price"
                  name="service_price"
                  placeholder="Price"
                  onChange={(e) => setPrice(e.target.value)}
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
              <ButtonMain type="submit" variant="success">
                Create
              </ButtonMain>
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
                <ButtonMain
                  onClick={() => deleteProduct(p.id)}
                  variant="delete"
                >
                  Delete
                </ButtonMain>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
