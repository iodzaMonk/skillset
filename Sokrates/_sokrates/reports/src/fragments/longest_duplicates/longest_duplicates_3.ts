features/support/productCrudFixture.ts [79:94]:
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



features/support/productCrudFixture.ts [118:133]:
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



