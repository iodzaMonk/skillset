"use client";
import Link, { LinkProps } from "next/link";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionLinkProps
  extends LinkProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
  className?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TransitionLink = ({
  children,
  href,
  className,
  onClick,
  target,
  ...props
}: TransitionLinkProps) => {
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    e.preventDefault();

    const body = document.body;
    body.classList.add("page-transition");
    await sleep(500);
    router.replace(href);
    await sleep(500);
    body.classList.remove("page-transition");
  };

  return (
    <Link
      {...props}
      href={href}
      onClick={handleTransition}
      className={className}
      target={target}
    >
      {children}
    </Link>
  );
};
