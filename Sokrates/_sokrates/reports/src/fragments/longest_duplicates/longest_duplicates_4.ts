app/api/product/route.ts [18:37]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        if (!product.image_location) {
          return product;
        }

        try {
          const imageUrl = await createSignedDownloadUrl(
            product.image_location,
          );
          return {
            ...product,
            image_url: imageUrl,
          };
        } catch (error) {
          console.error("Failed to sign image url", error);
          return product;
        }
      }),
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



app/api/product/user/route.ts [105:124]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        if (!product.image_location) {
          return product;
        }

        try {
          const imageUrl = await createSignedDownloadUrl(
            product.image_location,
          );
          return {
            ...product,
            image_url: imageUrl,
          };
        } catch (error) {
          console.error("Failed to sign image url", error);
          return product;
        }
      }),
    );
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



