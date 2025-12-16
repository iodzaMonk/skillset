features/step_definitions/product.steps.ts [121:126]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function (this: ProductWorld, table: DataTable) {
    const payload = getPayload(this);
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    const expectations = table.hashes();
    for (const row of expectations) {
      const reviewer = row.reviewer;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



features/step_definitions/product.steps.ts [140:145]:
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function (this: ProductWorld, table: DataTable) {
    const payload = getPayload(this);
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    const expectations = table.hashes();
    for (const row of expectations) {
      const reviewer = row.reviewer;
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



