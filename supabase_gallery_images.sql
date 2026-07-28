-- Cake gallery / past-work photos shown as a carousel on the Shop page
-- when a category (e.g. Torturi) is selected. One row per photo.
--
-- Run this in the Supabase SQL editor. Photos are uploaded to the existing
-- `product-images` Storage bucket; paste each photo's public URL into image_url.

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  -- Category the carousel belongs to (set to the Torturi/cakes category id).
  -- The Shop page shows the carousel for whichever selected category has rows.
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title_ro TEXT,
  title_en TEXT,
  order_index INT NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast lookup by category (carousel filters on category_id + isActive).
CREATE INDEX IF NOT EXISTS gallery_images_category_idx
  ON gallery_images (category_id, order_index);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Everyone can read active photos (the public Shop page needs them).
CREATE POLICY "gallery_images_public_read" ON gallery_images
  FOR SELECT USING ("isActive" = true);

-- Only the admin account can write. Change the email if the admin uses another one.
CREATE POLICY "gallery_images_admin_write" ON gallery_images
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'odette.confiserie@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'odette.confiserie@gmail.com');

-- Example (replace the URL and category_id with real values from your project):
-- INSERT INTO gallery_images (image_url, category_id, order_index) VALUES
--   ('https://ovajkmagjddlujgegcon.supabase.co/storage/v1/object/public/product-images/Tort%20modele%20custom/grand_cake1.jpg',
--    '<TORTURI_CATEGORY_UUID>', 1);
