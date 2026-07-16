-- Image framing settings for the landing page (focal point + zoom per element)
-- Used by the admin in-place image positioning tool (AdjustableImage component).
--
-- Run this in the Supabase SQL editor, then create the admin user in
-- Dashboard -> Authentication -> Add user, using the email in the policy below.

CREATE TABLE IF NOT EXISTS image_settings (
  element_key TEXT PRIMARY KEY,
  focal_x NUMERIC NOT NULL DEFAULT 50 CHECK (focal_x BETWEEN 0 AND 100),
  focal_y NUMERIC NOT NULL DEFAULT 50 CHECK (focal_y BETWEEN 0 AND 100),
  zoom NUMERIC NOT NULL DEFAULT 1 CHECK (zoom BETWEEN 1 AND 3),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE image_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read (the public site needs the framing values)
CREATE POLICY "image_settings_public_read" ON image_settings
  FOR SELECT USING (true);

-- Only the admin account can write. Change the email if the admin uses another one.
CREATE POLICY "image_settings_admin_write" ON image_settings
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'odette.confiserie@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'odette.confiserie@gmail.com');

-- Element keys currently used by the app:
--   'hero'            - landing hero photo (HeroSection.jsx)
--   'about_story'     - about/story card photo (AboutStory.jsx)
--   'faq_torturi'     - FAQ card photos (FAQ.jsx)
--   'faq_ingrediente'
--   'faq_candybar'
--   'faq_artizanal'
