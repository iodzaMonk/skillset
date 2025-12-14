import Image from "next/image";
import { useMemo } from "react";
import { useSelection } from "@/app/hooks/useSelection";

import { SelectableList } from "@/app/_components/SelectableList";
import { Button } from "@/components/ui/button";
import { PostBody } from "@/types/PostBody";
import { SelectableCard } from "@/app/_components/SelectableCard";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type PostListProps = {
  posts: PostBody[];
  onRequestEdit?: (post: PostBody) => void | Promise<void>;
  onRequestDelete?: (posts: PostBody[]) => void | Promise<void | boolean>;
  onRequestCreate?: () => void;
};

import { currencyFormatter } from "@/app/utils/formatters";

export function PostList({
  posts,
  onRequestEdit,
  onRequestDelete,
  onRequestCreate,
}: PostListProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { selectedIds, toggleSelection, clearSelection, selectAll } =
    useSelection(posts.map((post) => post.id).filter(Boolean) as string[]);

  const selectedPosts = useMemo(
    () => posts.filter((post) => post.id && selectedIds.includes(post.id)),
    [posts, selectedIds],
  );

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
            onClick={onRequestCreate}
          >
            Create product
          </Button>
        )}
      </section>
    );
  }

  return (
    <SelectableList<PostBody>
      items={posts}
      selectedIds={selectedIds}
      totalSelected={totalSelected}
      masterCheckboxState={masterCheckboxState}
      onSelectAll={selectAll}
      onClearSelection={clearSelection}
      onModify={handleModify}
      onDelete={handleDelete}
      onCreate={onRequestCreate}
      getItemId={(post) => post.id || ""}
      canModify={Boolean(onRequestEdit)}
      canDelete={Boolean(onRequestDelete)}
      renderItem={(product, isSelected) => {
        if (!product.id) return null;
        const postId = product.id;

        return (
          <SelectableCard
            key={postId}
            id={postId}
            isSelected={isSelected}
            onToggle={toggleSelection}
            label={product.title}
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
          </SelectableCard>
        );
      }}
    />
  );
}
