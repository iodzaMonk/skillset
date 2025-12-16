"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PostBody } from "@/types/PostBody";

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

type ProductCardProps = {
  product: PostBody;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "border-border/60 bg-surface/90 flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm",
        className,
      )}
    >
      <div className="bg-muted/60 relative h-52 w-full">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : product.image_location ? (
          <div className="text-text-muted flex h-full w-full items-center justify-center text-xs font-medium tracking-wide uppercase">
            Image stored at {product.image_location}
          </div>
        ) : (
          <div className="text-text-muted flex h-full w-full items-center justify-center text-xs font-medium tracking-wide uppercase">
            No image uploaded
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="text-text line-clamp-2 text-lg font-semibold">
          {product.title}
        </h2>
        {product.description && (
          <p className="text-text-muted line-clamp-3 text-sm leading-6">
            {product.description}
          </p>
        )}
        {product.category && <p>{product.category}</p>}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-accent text-xl font-semibold">
            {currencyFormatter.format(product.price)}
          </span>
          <Link
            href={`/product/${product.id}`}
            className="text-success hover:text-success/80 text-sm font-medium"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
