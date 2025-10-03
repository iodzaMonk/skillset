"use client";

import { FormEvent, Key } from "react";

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

const inputBase =
  "block w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-text placeholder:text-text-muted/70 " +
  "focus:outline-ring focus:ring-2 focus:ring-[--color-ring] focus:border-transparent transition resize-none";

const labelBase = "mb-2 block text-sm font-medium text-text";
const hintText = "text-sm text-text-muted";

export type Product = {
  id: Key;
  title: string;
  price: number;
  description: string;
};

export type MyProductsViewProps = {
  products: Product[];
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  productPendingDelete: Product | null;
  name: string;
  description: string;
  price: string;
  isEditing: boolean;
  onFormOpenChange: (open: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onStartEditing: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  onCancelForm: () => void;
  onCreateClick: () => void;
  onCloseDeleteDialog: () => void;
  onConfirmDelete: () => void | Promise<void>;
};

export function MyProductsView({
  products,
  isFormOpen,
  isDeleteDialogOpen,
  productPendingDelete,
  name,
  description,
  price,
  isEditing,
  onFormOpenChange,
  onSubmit,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onStartEditing,
  onRequestDelete,
  onCancelForm,
  onCreateClick,
  onCloseDeleteDialog,
  onConfirmDelete,
}: MyProductsViewProps) {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <Dialog open={isFormOpen} onOpenChange={onFormOpenChange}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-text text-2xl font-semibold">My Products</h1>
          <DialogTrigger asChild>
            <ButtonMain type="button" variant="info" onClick={onCreateClick}>
              Add a good/service
            </ButtonMain>
          </DialogTrigger>
        </div>

        <DialogContent className="bg-surface sm:max-w-[425px]">
          <form onSubmit={onSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle className={labelBase}>
                {isEditing ? "Edit good/service" : "Add a good/service"}
              </DialogTitle>
              <DialogDescription className={hintText}>
                {isEditing
                  ? "Update the details for this entry."
                  : "Fill in the details of the good/service you want to add."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="service_name" className={labelBase}>
                  Title
                </Label>
                <Input
                  id="service_name"
                  name="service_name"
                  placeholder="Title"
                  className={inputBase}
                  onChange={(event) => onNameChange(event.target.value)}
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
                  onChange={(event) => onDescriptionChange(event.target.value)}
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
                  onChange={(event) => onPriceChange(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <ButtonMain type="button" variant="info" onClick={onCancelForm}>
                Cancel
              </ButtonMain>
              <ButtonMain type="submit" variant="success">
                {isEditing ? "Save changes" : "Create"}
              </ButtonMain>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {products.length === 0 ? (
        <p className="text-text-muted">No products yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="border-border bg-surface rounded-lg border p-4"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-text text-lg font-semibold">
                  {product.title}
                </h2>
                <span className="text-accent font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {product.description && (
                <p className="text-text-muted mt-2 text-sm">
                  {product.description}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <ButtonMain
                  type="button"
                  variant="update"
                  onClick={() => onStartEditing(product)}
                >
                  Modify
                </ButtonMain>
                <ButtonMain
                  type="button"
                  variant="delete"
                  onClick={() => onRequestDelete(product)}
                >
                  Delete
                </ButtonMain>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            onCloseDeleteDialog();
          }
        }}
      >
        <DialogContent className="bg-surface sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={labelBase}>Are you sure?</DialogTitle>
            <DialogDescription className={hintText}>
              {productPendingDelete
                ? `This will permanently delete "${productPendingDelete.title}".`
                : "This action cannot be undone. This will permanently delete your product."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex justify-end gap-3">
            <ButtonMain
              type="button"
              variant="info"
              onClick={onCloseDeleteDialog}
            >
              Cancel
            </ButtonMain>
            <ButtonMain
              type="button"
              variant="delete"
              onClick={onConfirmDelete}
            >
              Yes, delete product
            </ButtonMain>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default MyProductsView;
