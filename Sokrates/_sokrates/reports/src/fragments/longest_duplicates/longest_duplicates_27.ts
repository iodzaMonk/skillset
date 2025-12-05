features/support/browseService.ts [22:34]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const normalized = value.trim() as Category;
  if (!Object.values(Category).includes(normalized)) {
    throw new Error(`Unknown category "${value}"`);
  }
  return normalized;
}

function parsePrice(value: string | undefined): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid price "${value}"`);
  }
  return parsed;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productService.ts [17:29]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  const normalized = value.trim() as Category;
  if (!Object.values(Category).includes(normalized)) {
    throw new Error(`Unknown category "${value}"`);
  }
  return normalized;
}

function parsePrice(value: string | undefined): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid price "${value}"`);
  }
  return parsed;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



