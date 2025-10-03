import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonVariants = cva(
  "inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium hover:text-white focus:ring-4 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        info: "border-amber-600 text-amber-600 hover:bg-amber-600 focus:ring-amber-300",
        delete:
          "border-red-600 text-red-600 hover:bg-red-600 focus:ring-red-300",
        success:
          "border-green-600 text-green-600 hover:bg-green-600 focus:ring-green-300",
        update:
          "border-blue-600 text-blue-600 hover:bg-blue-600 focus:ring-blue-300",
      },
    },
  },
);

const variantIcons: Record<
  NonNullable<VariantProps<typeof buttonVariants>["variant"]>,
  React.ReactNode
> = {
  info: (
    <svg className="mr-1 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12H9v-2h2v2zm0-4H9V7h2v3z" />
    </svg>
  ),
  delete: (
    <svg className="mr-1 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg className="mr-1 -ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  update: (
    <svg
      className="h-6 w-6"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        fillRule="evenodd"
        d="M11.32 6.176H5c-1.105 0-2 .949-2 2.118v10.588C3 20.052 3.895 21 5 21h11c1.105 0 2-.948 2-2.118v-7.75l-3.914 4.144A2.46 2.46 0 0 1 12.81 16l-2.681.568c-1.75.37-3.292-1.263-2.942-3.115l.536-2.839c.097-.512.335-.983.684-1.352l2.914-3.086Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M19.846 4.318a2.148 2.148 0 0 0-.437-.692 2.014 2.014 0 0 0-.654-.463 1.92 1.92 0 0 0-1.544 0 2.014 2.014 0 0 0-.654.463l-.546.578 2.852 3.02.546-.579a2.14 2.14 0 0 0 .437-.692 2.244 2.244 0 0 0 0-1.635ZM17.45 8.721 14.597 5.7 9.82 10.76a.54.54 0 0 0-.137.27l-.536 2.84c-.07.37.239.696.588.622l2.682-.567a.492.492 0 0 0 .255-.145l4.778-5.06Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function ButtonMain({
  className,
  variant,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={clsx(buttonVariants({ variant }), className)} {...props}>
      {variant && variantIcons[variant]}
      {children}
    </button>
  );
}
