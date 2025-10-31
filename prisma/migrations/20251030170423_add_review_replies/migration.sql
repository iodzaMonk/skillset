-- Add parent_id for nested replies
ALTER TABLE "reviews"
ADD COLUMN "parent_id" VARCHAR;

-- Create self-referencing foreign key to enforce hierarchy
ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_parent_id_fkey"
FOREIGN KEY ("parent_id") REFERENCES "reviews"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Helpful index for product reply lookups
CREATE INDEX "reviews_product_id_parent_id_idx"
ON "reviews"("product_id", "parent_id");
