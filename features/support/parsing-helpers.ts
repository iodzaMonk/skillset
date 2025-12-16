import { Category } from "@/types/Category";

export function parseCategory(value: string | undefined): Category {
  if (!value) {
    throw new Error("Category is required");
  }
  const normalized = value.trim() as Category;
  if (!Object.values(Category).includes(normalized)) {
    throw new Error(`Unknown category "${value}"`);
  }
  return normalized;
}

export function parsePrice(value: string | undefined): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid price "${value}"`);
  }
  return parsed;
}
