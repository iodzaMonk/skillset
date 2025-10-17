"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PostBody } from "@/types/PostBody";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  product: PostBody;
}

export default function Modal({
  isOpen,
  onClose,
  description,
  onDescriptionChange,
  onSubmit,
  isSubmitting,
  error,
  product,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Order {product.title}
          </DialogTitle>
          <DialogDescription className="text-text-muted text-sm">
            Total Price: ${product.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Order Details
            </Label>
            <textarea
              id="description"
              className="border-border bg-surface/60 min-h-[100px] w-full rounded-md border p-3 text-sm disabled:opacity-50"
              placeholder="Please provide any specific requirements or details for your order..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              disabled={isSubmitting}
              required
            />
            {error && <p className="text-error text-sm">{error}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border-border hover:bg-surface rounded-md border px-4 py-2 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-sm text-white disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Place Order"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
