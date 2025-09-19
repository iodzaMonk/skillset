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
import { useState } from "react";
const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition";

const labelBase = "mb-2 block text-sm font-medium text-text";
const hintText = "text-sm text-text-muted";
export default function MyProducts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("Submitting form...");
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload = {
      name: form.get("service_name"),
      description: form.get("service_description"),
      price: form.get("service_price"),
    };
    try {
      const response = await axios.post("/api/product", payload);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={labelBase}>
          Add a good/service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className={labelBase}>Add a good/service</DialogTitle>
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
  );
}
