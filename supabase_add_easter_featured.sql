-- Add Easter Featured column to categories table
-- This column flags categories whose products should display an Easter badge

ALTER TABLE categories
ADD COLUMN IF NOT EXISTS "isEasterFeatured" boolean DEFAULT false;

-- Example: To mark a category as Easter featured, run:
-- UPDATE categories SET "isEasterFeatured" = true WHERE name_en = 'YourCategoryName';
