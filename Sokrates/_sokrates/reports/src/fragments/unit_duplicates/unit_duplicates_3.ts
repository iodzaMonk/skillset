features/support/browseService.ts [18:27]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function parseCategory(value: string | undefined): Category {
  if (!value) {
    throw new Error("Category is required for each product row");
  }
  const normalized = value.trim() as Category;
  if (!Object.values(Category).includes(normalized)) {
    throw new Error(`Unknown category "${value}"`);
  }
  return normalized;
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productService.ts [13:22]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function parseCategory(value: string | undefined): Category {
  if (!value) {
    throw new Error("Category is required for product rows");
  }
  const normalized = value.trim() as Category;
  if (!Object.values(Category).includes(normalized)) {
    throw new Error(`Unknown category "${value}"`);
  }
  return normalized;
}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



