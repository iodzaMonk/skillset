// CategorySelectEnum.tsx
import React from "react";

type StringEnum = Record<string, string>; // Prisma's exported enum object

type EnumValue<E extends StringEnum> = E[keyof E];

export function CategorySelectEnum<E extends StringEnum>({
  enumObj,
  value,
  onChange,
  labelMap, // optional pretty labels
  allowClear = false,
  className = "",
}: {
  enumObj: E;
  value: EnumValue<E> | null;
  onChange: (v: EnumValue<E> | null) => void;
  labelMap?: Partial<Record<EnumValue<E>, string>>;
  allowClear?: boolean;
  className?: string;
}) {
  const items = React.useMemo(
    () => Object.values(enumObj) as EnumValue<E>[],
    [enumObj],
  );

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="radiogroup">
      {items.map((id) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={[
              "mb-10 inline-flex items-center rounded-2xl border px-3 py-1.5 text-sm transition focus:ring-2 focus:ring-offset-2 focus:outline-none",
              selected
                ? "border-gray-900 bg-gray-900 text-white shadow"
                : "border-gray-200 bg-white text-gray-800 hover:border-gray-400",
            ].join(" ")}
            onClick={() => onChange(allowClear && selected ? null : id)}
          >
            <span className="font-medium">{labelMap?.[id] ?? String(id)}</span>
          </button>
        );
      })}
    </div>
  );
}
