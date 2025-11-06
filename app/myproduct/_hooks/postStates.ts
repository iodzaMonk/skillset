"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import {
  createProduct,
  deleteProduct,
  fetchUserProducts,
  updateProduct,
} from "@/app/lib/products";
import { PostBody } from "@/types/PostBody";
import { deleteFile } from "../actions";

async function uploadImage(file: File) {
  const body = new FormData();
  body.append("file", file);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const { key } = (await response.json()) as { key: string };
  return key;
}

type UsePostManagerOptions = {
  userId?: string;
};

export function usePostManager({ userId }: UsePostManagerOptions = {}) {
  const [posts, setPosts] = useState<PostBody[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<PostBody | null>(null);
  const [file, setFile] = useState<File | undefined>();
  const [filePreview, setFilePreview] = useState<string | undefined>();
  /**
   * Refreshes posts
   * @async
   */
  const refreshPosts = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchUserProducts();
      setPosts(data);
    } catch (error) {
      console.error("Unable to load products", error);
    }
  }, []);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  /**
   * Handles submits of all kinds, uses `useCallBack()` to cache in the method in other components.
   *
   * Used for creating and updating posts
   * @async
   */
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!userId) {
        console.error("User must be authenticated to create a product");
        return false;
      }
      // payload
      const formData = new FormData(event.currentTarget);
      const title = (formData.get("title") as string | null)?.trim() ?? "";
      const description =
        (formData.get("description") as string | null)?.trim() ?? "";
      const priceInput = (formData.get("price") as string | null) ?? "0";

      const price = parseFloat(priceInput);
      const category =
        (formData.get("category") as string | null)?.trim() ?? "";
      console.log(category);
      if (!title || !description || Number.isNaN(price) || !category) {
        console.error("Form data is invalid");
        return false;
      }

      setIsSubmitting(true);
      try {
        let imageLocation: string | undefined;

        if (file) {
          imageLocation = await uploadImage(file);
        }

        // edit post
        // TODO: add category handle
        if (editingPost) {
          await updateProduct({
            ...editingPost,
            user_id: userId,
            title,
            description,
            price,
            image_location: imageLocation ?? editingPost.image_location,
            category,
          });
          setEditingPost(null);
        } else {
          // create post
          // TODO: add category handle
          await createProduct({
            user_id: userId,
            title,
            description,
            price,
            image_location: imageLocation,
            category,
          });
        }
        await refreshPosts();

        if (filePreview) {
          URL.revokeObjectURL(filePreview);
        }

        setFile(undefined);
        setFilePreview(undefined);
        return true;
      } catch (error) {
        console.error("Failed to create product", error);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingPost, file, filePreview, refreshPosts, userId],
  );

  /**
   * Deletes selected post
   * @param items
   */
  const deletePosts = useCallback(
    async (items: PostBody[]) => {
      const deletions = await Promise.all(
        items.map(async (post) => {
          if (!post.id) {
            return false;
          }

          try {
            await deleteProduct(post.id);
            if (post.image_location) {
              await deleteFile(post.image_location);
            }
            return true;
          } catch (error) {
            console.error("Failed to delete product", error);
            return false;
          }
        }),
      );

      const didDeleteAny = deletions.some(Boolean);

      if (didDeleteAny) {
        await refreshPosts();
      }

      return didDeleteAny;
    },
    [refreshPosts],
  );

  const startEditing = useCallback(
    (item: PostBody) => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFile(undefined);
      setFilePreview(undefined);
      setEditingPost(item);
    },
    [filePreview],
  );

  const resetEditing = useCallback(() => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(undefined);
    setFilePreview(undefined);
    setEditingPost(null);
  }, [filePreview]);

  const handleFile = useCallback((nextFile: File | undefined) => {
    setFile(nextFile);
    setFilePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      return nextFile ? URL.createObjectURL(nextFile) : undefined;
    });
  }, []);

  return {
    posts,
    handleSubmit,
    isSubmitting,
    deletePosts,
    editingPost,
    startEditing,
    resetEditing,
    file,
    filePreview,
    handleFile,
  };
}
