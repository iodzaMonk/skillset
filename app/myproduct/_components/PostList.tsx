"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostBody } from "@/types/PostBody";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type PostListProps = {
  posts: PostBody[];
  onRequestEdit?: (post: PostBody) => void | Promise<void>;
  onRequestDelete?: (posts: PostBody[]) => void | Promise<void | boolean>;
  onRequestCreate?: () => void;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function PostList({
  posts,
  onRequestEdit,
  onRequestDelete,
  onRequestCreate,
}: PostListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  const selectedPosts = useMemo(
    () => posts.filter((post) => post.id && selectedIds.includes(post.id)),
    [posts, selectedIds],
  );

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => posts.some((post) => post.id === id)),
    );
  }, [posts]);

  const toggleSelection = (postId: string | undefined) => {
    if (!postId) {
      return;
    }

    setSelectedIds((current) => {
      if (current.includes(postId)) {
        return current.filter((id) => id !== postId);
      }
      return [...current, postId];
    });
  };
  const clearSelection = () => setSelectedIds([]);

  const selectAll = () => {
    setSelectedIds(posts.map((post) => post.id).filter(Boolean) as string[]);
  };

  const totalSelected = selectedPosts.length;
  const totalPosts = posts.length;

  const masterCheckboxState =
    totalSelected === 0
      ? false
      : totalSelected === totalPosts
        ? true
        : "indeterminate";

  const handleModify = () => {
    if (totalSelected !== 1 || !onRequestEdit) {
      return;
    }
    void onRequestEdit(selectedPosts[0]);
  };

  const handleDelete = async () => {
    if (totalSelected === 0 || !onRequestDelete) {
      return;
    }
    const result = await onRequestDelete(selectedPosts);
    if (result !== false) {
      clearSelection();
    }
  };
  if (!user?.vendor_id && posts.length === 0) {
    return (
      <section className="border-border bg-surface/60 mx-auto mt-10 flex w-full flex-col items-center gap-4 rounded-xl border p-10 text-center md:w-4/5 lg:w-3/4">
        <p className="text-text-muted text-sm">
          Create a vendor account before creating products
        </p>
        {onRequestCreate && (
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={() => router.push("/settings")}
          >
            Create a vendor account
          </Button>
        )}
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="border-border bg-surface/60 mx-auto mt-10 flex w-full flex-col items-center gap-4 rounded-xl border p-10 text-center md:w-4/5 lg:w-3/4">
        <p className="text-text-muted text-sm">
          Once you add a product it will appear here.
        </p>
        {onRequestCreate && (
          <Button
            type="button"
            variant="success"
            size="sm"
            data-testid="create-product-button"
            onClick={onRequestCreate}
          >
            Create product
          </Button>
        )}
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-4xl px-2 sm:px-0">
      <div className="border-border bg-surface/80 mb-4 flex flex-col gap-4 rounded-xl border px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            id="select-all"
            checked={masterCheckboxState}
            onCheckedChange={(checked) => {
              if (checked === true) {
                selectAll();
              } else if (checked === false) {
                clearSelection();
              }
            }}
          />
          <label htmlFor="select-all" className="text-text text-sm font-medium">
            {totalSelected > 0
              ? `${totalSelected} selected`
              : "Select items to manage them"}
          </label>
        </div>

        {totalSelected > 0 && (
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button
              type="button"
              variant="update"
              size="sm"
              onClick={handleModify}
              disabled={totalSelected !== 1 || !onRequestEdit}
            >
              <PencilIcon className="size-4" />
              Modify
            </Button>
            <Button
              type="button"
              variant="delete"
              size="sm"
              onClick={() => {
                void handleDelete();
              }}
              disabled={!onRequestDelete}
            >
              <Trash2Icon className="size-4" />
              Delete
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        )}
        <Button
          type="button"
          variant="success"
          size="sm"
          className="w-full sm:w-auto"
          onClick={onRequestCreate}
          disabled={!onRequestCreate || totalSelected >= 1}
        >
          Create
        </Button>
      </div>

      <ScrollArea className="border-border/40 bg-surface/70 mb-10 h-[28rem] rounded-xl border pr-1 sm:h-[34rem]">
        <ul className="space-y-4 p-3 sm:p-4">
          {posts.map((product) => {
            if (!product.id) {
              return null;
            }

            const postId = product.id;
            const isSelected = selectedIds.includes(postId);

            return (
              <li
                key={postId}
                className={`border-border/70 bg-surface/95 relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg ${
                  isSelected ? "ring-accent shadow-xl ring-2" : "shadow-sm"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelection(postId)}
                  aria-label={`Select ${product.title}`}
                  className="border-border bg-surface absolute top-4 left-4 z-10 size-5 rounded-full border-2"
                />
                <button
                  type="button"
                  onClick={() => toggleSelection(postId)}
                  className="flex w-full flex-col gap-4 p-4 text-left sm:flex-row sm:items-start sm:gap-6 sm:p-6"
                >
                  <div className="bg-surface/80 relative w-full overflow-hidden rounded-lg sm:w-56">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        width={448}
                        height={336}
                        className="h-48 w-full object-cover"
                      />
                    ) : product.image_location ? (
                      <div className="border-border/80 text-text-muted flex h-48 w-full items-center justify-center border border-dashed text-xs tracking-wide uppercase">
                        Image stored at {product.image_location}
                      </div>
                    ) : (
                      <div className="border-border/80 text-text-muted flex h-48 w-full items-center justify-center border border-dashed text-xs tracking-wide uppercase">
                        No image uploaded
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <h2 className="text-text text-lg font-semibold sm:text-xl">
                          {product.title}
                        </h2>
                        {product.description && (
                          <p className="text-text-muted text-sm leading-6">
                            {product.description}
                          </p>
                        )}
                      </div>

                      {product.price !== undefined && (
                        <div className="text-accent border-accent/50 inline-flex min-w-[6rem] items-center justify-center rounded-full border px-4 py-1 text-base font-semibold">
                          {currencyFormatter.format(product.price)}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <span className="text-accent bg-accent/10 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}
