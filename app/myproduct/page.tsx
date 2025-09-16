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
        <Button variant="outline">Add a good/service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add a good/service</DialogTitle>
            <DialogDescription>
              Fill in the details of the good/service you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="service_name">Title</Label>
              <Input
                id="service_name"
                name="service_name"
                placeholder="Title"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="service_description">Description</Label>
              <textarea
                className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring h-24 rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                id="service_description"
                name="service_description"
                placeholder="Description"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="service_price">Price</Label>
              <input
                className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                type="number"
                step="0.01"
                min="0"
                id="service_price"
                name="service_price"
                placeholder="Price"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
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
