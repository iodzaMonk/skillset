import { MonitorCheck, ShieldQuestion, XCircle } from "lucide-react";
import { Dispatch, forwardRef, SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { Status } from "@/types/Status";
import { Order } from "@/types/Order";

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  toggle: boolean;
  selectedStatus: Status | null;
  selectedOrder: Order | null;
  setSelectedStatus: Dispatch<SetStateAction<Status | null>>;
}

type ModalOption = {
  id: Status;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  accent: string;
};

const OPTIONS: ModalOption[] = [
  {
    id: Status.accept,
    label: "Accept Order",
    description: "Confirm you’ll deliver the work within the agreed timeline.",
    icon: MonitorCheck,
    gradient:
      "bg-[radial-gradient(circle_at_top,var(--color-accent)_0%,color-mix(in_oklch,var(--color-accent)_45%,var(--color-surface)_55%)_45%,var(--color-surface)_100%)]",
    accent:
      "shadow-[0_28px_42px_-24px_color-mix(in_oklch,var(--color-accent)_65%,transparent)]",
  },
  {
    id: Status.review,
    label: "Request Review",
    description:
      "Ask for clarification or additional requirements from the client.",
    icon: ShieldQuestion,
    gradient:
      "bg-[radial-gradient(circle_at_top,var(--color-secondary)_0%,color-mix(in_oklch,var(--color-secondary)_45%,var(--color-surface)_55%)_45%,var(--color-surface)_100%)]",
    accent:
      "shadow-[0_28px_42px_-24px_color-mix(in_oklch,var(--color-secondary)_60%,transparent)]",
  },
  {
    id: Status.decline,
    label: "Decline Order",
    description: "Let the client know you aren’t able to take this project.",
    icon: XCircle,
    gradient:
      "bg-[radial-gradient(circle_at_top,var(--color-primary)_0%,color-mix(in_oklch,var(--color-primary)_40%,var(--color-surface)_60%)_45%,var(--color-surface)_100%)]",
    accent:
      "shadow-[0_28px_42px_-24px_color-mix(in_oklch,var(--color-primary)_60%,transparent)]",
  },
];

export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    toggle = false,
    selectedStatus,
    selectedOrder,
    setSelectedStatus,
    className,
    ...props
  },
  ref,
) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex h-screen w-screen justify-end transition duration-200",
        toggle
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 h-screen w-screen"
        style={{
          background:
            "color-mix(in oklch, var(--color-text) 35%, transparent 65%)",
        }}
      />

      <aside
        ref={ref}
        {...props}
        className={cn(
          "relative z-10 flex h-full w-full max-w-[420px] flex-col overflow-hidden border-l border-[color-mix(in_oklch,var(--color-border)_70%,transparent)] bg-[color-mix(in_oklch,var(--color-surface)_94%,transparent)] shadow-[0_18px_50px_-28px_color-mix(in_oklch,var(--color-text)_60%,transparent)] transition-transform duration-300 ease-out",
          toggle ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <div className="flex flex-col gap-6 px-8 pt-12 pb-10">
          <header className="space-y-3">
            <h2 className="text-sm font-semibold tracking-[0.32em] text-[var(--color-text-muted)] uppercase">
              Order Panel
            </h2>
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-[var(--color-text)]">
                Manage current request
              </p>
              <p className="text-sm leading-relaxed text-[color-mix(in_oklch,var(--color-text-muted)_90%,transparent)]">
                Choose a next action so the client stays informed about what
                comes next.
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-4">
            {OPTIONS.map((option) => {
              const effectiveStatus = selectedStatus ?? selectedOrder?.status;
              const isSelected = effectiveStatus === option.id;

              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedStatus(option.id)}
                  className={cn(
                    "group relative flex items-start gap-4 rounded-3xl border border-[color-mix(in_oklch,var(--color-border)_75%,transparent)] bg-[color-mix(in_oklch,var(--color-surface-2)_85%,transparent)] px-5 py-6 text-left transition-all duration-200 focus-visible:ring-3 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-4 focus-visible:ring-offset-[color-mix(in_oklch,var(--color-surface)_94%,transparent)] focus-visible:outline-none",
                    isSelected
                      ? cn(
                          "border-transparent text-[var(--color-text-onAccent)] shadow-[0_24px_45px_-26px_color-mix(in_oklch,var(--color-primary)_60%,transparent)]",
                          option.gradient,
                        )
                      : "hover:border-transparent hover:bg-[color-mix(in_oklch,var(--color-accent)_40%,var(--color-surface)_60%)]",
                  )}
                >
                  <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[color-mix(in_oklch,var(--color-surface)_70%,transparent)] text-[var(--color-text)]">
                    <Icon className="size-6" />
                  </span>

                  <span className="flex flex-1 flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold tracking-[0.28em] text-[color-mix(in_oklch,var(--color-text-muted)_90%,transparent)] uppercase">
                      {option.id}
                    </span>
                    <span className="text-lg font-semibold text-[var(--color-text)]">
                      {option.label}
                    </span>
                    <span className="text-sm leading-relaxed text-[color-mix(in_oklch,var(--color-text-muted)_92%,transparent)]">
                      {option.description}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "mt-2 inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200",
                      isSelected
                        ? "bg-[var(--color-text-onAccent)] text-[var(--color-text)]"
                        : "bg-[color-mix(in_oklch,var(--color-border)_80%,transparent)] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {isSelected ? "Selected" : "Preview"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
});
