"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type modalProps = {
  isEditing: boolean;
  initialValues?: Partial<{
    id: string;
    title: string;
    description: string;
    price: number;
  }>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<boolean>;
  isSubmitting?: boolean;
  triggerLabel?: string;
  showTrigger?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
  onFileChange?: (file: File | undefined) => void;
  filePreview?: string;
};

export default function Modal({
  isEditing,
  initialValues,
  onSubmit,
  isSubmitting = false,
  triggerLabel,
  showTrigger = true,
  onClose,
  forceOpen,
  onFileChange,
  filePreview,
}: modalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setOpen(true);
    }
  }, [initialValues]);

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
    }
  }, [forceOpen]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      onClose?.();
    }
  };

  const actionLabel = triggerLabel ?? (isEditing ? "Modify" : "Create");
  const formKey = initialValues?.id ?? (isEditing ? "edit" : "create");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant={isEditing ? "update" : "success"} type="button">
            {actionLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form
          key={formKey}
          onSubmit={async (event) => {
            const success = await onSubmit(event);
            if (success) {
              setOpen(false);
            }
          }}
          className="space-y-6"
        >
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit" : "Create"} post</DialogTitle>
            <DialogDescription>
              {isEditing ? "Make changes to" : "Create"} your profile here.
              Click {isEditing ? "save" : "create"} when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                required
                defaultValue={initialValues?.title ?? ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                name="description"
                id="description"
                required
                defaultValue={initialValues?.description ?? ""}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="price">Price</Label>
              <Input
                name="price"
                id="price"
                type="number"
                min="0"
                step="0.01"
                required
                defaultValue={
                  initialValues?.price !== undefined ? initialValues.price : ""
                }
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="image">Image</Label>
              <Input
                name="image"
                id="image"
                type="file"
                onChange={(event) => onFileChange?.(event.target.files?.[0])}
              />
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Selected preview"
                  className="h-32 w-full rounded-md object-cover"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="cancel">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
