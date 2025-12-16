import { createSignedDownloadUrl } from "./storage/s3";

const signItemImage = async <T extends { image_location?: string | null }>(
  item: T,
): Promise<T & { image_url?: string }> => {
  if (!item.image_location) {
    return item;
  }

  try {
    const imageUrl = await createSignedDownloadUrl(item.image_location);
    return {
      ...item,
      image_url: imageUrl,
    };
  } catch (error) {
    console.error("Failed to sign image url", error);
    return item;
  }
};

export async function signProductsWithImages<
  T extends { image_location?: string | null },
>(products: T[]): Promise<(T & { image_url?: string })[]> {
  return Promise.all(products.map(signItemImage));
}

export async function signProductWithImage<
  T extends { image_location?: string | null },
>(product: T | null): Promise<(T & { image_url?: string }) | null> {
  if (!product) {
    return null;
  }

  return signItemImage(product);
}
