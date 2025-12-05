features/support/productCrudFixture.ts [73:88]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if (!this.userId) {
      this.response = {
        status: 401,
        body: { message: "Not authenticated" },
      };
      return;
    }
    const productId = this.productTitles.get(title);
    if (!productId) {
      this.response = {
        status: 404,
        body: { message: "Product not found" },
      };
      return;
    }
    try {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/support/productCrudFixture.ts [112:127]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    if (!this.userId) {
      this.response = {
        status: 401,
        body: { message: "Not authenticated" },
      };
      return;
    }
    const productId = this.productTitles.get(title);
    if (!productId) {
      this.response = {
        status: 404,
        body: { message: "Product not found" },
      };
      return;
    }
    try {
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



