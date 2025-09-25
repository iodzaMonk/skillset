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
                onClick={handleDialogClose}
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
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => Modify(p)}
                    className="inline-flex items-center rounded-lg border border-blue-600 px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <svg
                      className="mr-1 -ml-1 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                    Modify
                  </button>
                  <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
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
                    </DialogTrigger>
                    <DialogContent className="bg-surface sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className={labelBase}>
                          Are you sure?
                        </DialogTitle>
                        <DialogDescription className={hintText}>
                          This action cannot be undone. This will permanently
                          delete your product.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-6 flex justify-end gap-3">
                        <Button
                          className="hover:bg-text-muted/20 border-1"
                          type="button"
                          variant="outline"
                          onClick={() => setDeleteOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="border-1 bg-red-600/60 hover:bg-red-600/70"
                        >
                          Yes, delete product
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </main>
  );
}
