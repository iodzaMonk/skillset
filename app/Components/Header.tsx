"use client";
import { DarkThemeToggle } from "flowbite-react";
import { TransitionLink } from "../utils/TransitionLink";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  href?: string;
  action?: () => Promise<void> | void;
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isProcessingLogout, setIsProcessingLogout] = useState(false);

  const handleLogout = async () => {
    try {
      setIsProcessingLogout(true);
      await logout();
      router.push("/auth/login");
    } finally {
      setIsProcessingLogout(false);
    }
  };

  const navList: NavItem[] = user
    ? [
        { name: "About us", href: "/about" },
        { name: "Browse", href: "/browse" },
        { name: "My Products", href: "/myproduct" },
        { name: "My Cart", href: "/myorderslist" },
        { name: "My orders", href: "/orders" },
        { name: "Settings", href: "/settings" },
        { name: "Logout", action: handleLogout },
      ]
    : [
        { name: "Login", href: "/auth/login" },
        { name: "Sign up", href: "/auth/signup" },
        { name: "About us", href: "/about" },
        { name: "Browse", href: "/browse" },
      ];

  useEffect(() => {
    if (open) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!open) return;
      const panel = popupRef.current;
      const trigger = triggerRef.current;
      const target = e.target as Node;
      if (trigger && (trigger === target || trigger.contains(target))) return;
      if (panel && !panel.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const itemClasses =
    "text-text hover:text-accent relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[--color-accent] after:transition-all after:duration-700 hover:after:w-full";

  return (
    <>
      <header className="text-text relative z-50 mx-auto h-20 w-[95%]">
        <nav className="fixed mx-auto flex w-[95%] items-center justify-between py-4">
          <TransitionLink
            href="/"
            className="!font-tinos text-text hover:text-accent z-50 text-4xl italic transition-colors"
          >
            SkillSet
          </TransitionLink>

          <div className="flex items-center">
            {/* Flowbite toggle picks up tokens automatically */}
            <DarkThemeToggle className="border-border bg-surface text-text hover:bg-surface-2 mr-4 rounded-md border px-2 py-1 focus:ring-2 focus:ring-[--color-ring] focus:outline-none" />

            {/* Hamburger uses currentColor so we can theme it */}
            <button
              ref={triggerRef}
              className="group text-text hover:text-accent relative z-50 flex size-10 flex-col items-center justify-center rounded-full focus:ring-2 focus:ring-[--color-ring] focus:outline-none"
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={[
                  "absolute top-1/2 left-1/2 h-[1.5px] w-6 -translate-x-1/2 bg-current transition-all duration-700",
                  open ? "-rotate-45" : "-translate-y-1 rotate-0",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute top-1/2 left-1/2 h-[1.5px] w-6 -translate-x-1/2 bg-current transition-all duration-700",
                  open ? "rotate-45" : "translate-y-1 rotate-0",
                ].join(" ")}
              />
              <svg
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-text/70 absolute size-10"
              >
                <circle
                  cx="26"
                  cy="26"
                  r="25"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="circle-path"
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Flyout */}
      <div
        ref={panelRef}
        className={[
          "fixed right-0 bottom-0 z-30 flex h-screen w-screen justify-center p-5 transition-all duration-700",
          "text-text",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <nav
          ref={popupRef}
          className={[
            "absolute top-20 z-40 flex w-[min(640px,70vw)] justify-center rounded-2xl border py-2 transition-all duration-700",
            "bg-surface/95 border-border backdrop-blur",
            open
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-6 opacity-0",
          ].join(" ")}
        >
          <ul className="group">
            {navList.map((item, index) => (
              <li
                key={item.name}
                className="p-6 text-5xl transition-all duration-500 group-hover:opacity-40 group-hover:blur-[1px] hover:scale-105 hover:opacity-100 hover:blur-none"
              >
                {item.action ? (
                  <button
                    type="button"
                    onClick={async () => {
                      setOpen(false);
                      await item.action?.();
                    }}
                    disabled={isProcessingLogout && item.name === "Logout"}
                    className={`${itemClasses} ${
                      isProcessingLogout && item.name === "Logout"
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                  >
                    <span className="text-text-muted absolute top-2 -left-4 text-sm">
                      0{index + 1}
                    </span>
                    {item.name}
                  </button>
                ) : (
                  <TransitionLink
                    href={item.href!}
                    onClick={() => setOpen(false)}
                    className={itemClasses}
                  >
                    <span className="text-text-muted absolute top-2 -left-4 text-sm">
                      0{index + 1}
                    </span>
                    {item.name}
                  </TransitionLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Backdrop keyed to canvas, not pure black */}
        <div
          className={[
            "absolute inset-0 z-30 h-screen w-screen",
            "bg-transition/30",
            "transition-opacity duration-700",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />
      </div>
    </>
  );
}
