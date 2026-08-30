-- ============================================================
-- EE-KALAVARA — Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, code_prefix, description, display_order, is_active) VALUES
  ('Toys', 'toys', 'TOY', 'Handpicked toys for all ages — local shops and trusted brands', 1, true),
  ('Fashion', 'fashion', 'FASH', 'Clothing, fabrics, and wearables from Kerala designers and suppliers', 2, true),
  ('Electronics', 'electronics', 'ELEC', 'Gadgets, accessories, and tech products', 3, true),
  ('Home', 'home', 'HOME', 'Home décor, kitchenware, and household essentials', 4, true),
  ('Gifts', 'gifts', 'GIFT', 'Curated gift items and hampers for every occasion', 5, true),
  ('Accessories', 'accessories', 'ACC', 'Bags, jewellery, and personal accessories', 6, true),
  ('3D Products', '3d-products', '3DP', 'Custom 3D-printed products from local makers', 7, true),
  ('Others', 'others', 'OTH', 'Unique finds that don''t fit a single category', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCT CODE SEQUENCES
-- ============================================================
INSERT INTO product_code_sequences (code_prefix, next_number) VALUES
  ('TOY', 1),
  ('FASH', 1),
  ('ELEC', 1),
  ('HOME', 1),
  ('GIFT', 1),
  ('ACC', 1),
  ('3DP', 1),
  ('OTH', 1)
ON CONFLICT (code_prefix) DO NOTHING;

-- ============================================================
-- SAMPLE SELLER
-- ============================================================
INSERT INTO sellers (business_name, contact_person, phone, whatsapp, location, status)
VALUES ('Kalavara Verified Supplier', 'Kalavara Team', '9400634966', '9400634966', 'Kerala', 'active')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE PRODUCTS (will be updated with real images later)
-- Note: These use placeholder images from Supabase Storage
-- Admin should replace with real product photos
-- ============================================================

-- We'll insert products after categories are confirmed inserted
-- Products reference category_id, so we use subqueries

INSERT INTO products (name, code, slug, category_id, description, price, price_display_mode, availability, is_featured, is_published)
VALUES
  (
    'Remote Control Toy Car',
    'EK-TOY-001',
    'ek-toy-001',
    (SELECT id FROM categories WHERE slug = 'toys'),
    'High-speed remote control toy car with rechargeable battery. Suitable for ages 6 and above. Available in red and blue.',
    750,
    'exact',
    'available',
    true,
    true
  ),
  (
    'Building Blocks Set (100 Pieces)',
    'EK-TOY-002',
    'ek-toy-002',
    (SELECT id FROM categories WHERE slug = 'toys'),
    'Classic multi-colour building blocks set. 100 pieces, compatible with major brands. Develops creativity and motor skills.',
    550,
    'exact',
    'available',
    false,
    true
  ),
  (
    'Handloom Cotton Saree',
    'EK-FASH-001',
    'ek-fash-001',
    (SELECT id FROM categories WHERE slug = 'fashion'),
    'Traditional Kerala handloom cotton saree with golden kasavu border. Single piece, woven by local artisans in Thrissur.',
    1800,
    'approximate',
    'check_availability',
    true,
    true
  ),
  (
    'Cotton Kurta (Men)',
    'EK-FASH-002',
    'ek-fash-002',
    (SELECT id FROM categories WHERE slug = 'fashion'),
    'Lightweight pure cotton kurta. Available in white, cream, and light blue. Sizes: S, M, L, XL, XXL.',
    650,
    'exact',
    'available',
    false,
    true
  ),
  (
    'USB-C Hub 7-in-1',
    'EK-ELEC-001',
    'ek-elec-001',
    (SELECT id FROM categories WHERE slug = 'electronics'),
    '7-in-1 USB-C Hub with HDMI 4K, 3× USB-A, SD card reader, TF card reader, and 100W PD charging. Compatible with all USB-C laptops.',
    1200,
    'exact',
    'available',
    true,
    true
  ),
  (
    'Wireless Earbuds',
    'EK-ELEC-002',
    'ek-elec-002',
    (SELECT id FROM categories WHERE slug = 'electronics'),
    'True wireless earbuds with 24-hour battery life (6h buds + 18h case). Active noise cancellation. IPX4 water resistant.',
    1999,
    'exact',
    'available',
    false,
    true
  ),
  (
    'Bamboo Kitchen Organiser',
    'EK-HOME-001',
    'ek-home-001',
    (SELECT id FROM categories WHERE slug = 'home'),
    'Eco-friendly bamboo kitchen organiser with 5 compartments. Perfect for spices, cutlery, or desk organisation.',
    480,
    'exact',
    'available',
    false,
    true
  ),
  (
    'Handmade Ceramic Mug',
    'EK-HOME-002',
    'ek-home-002',
    (SELECT id FROM categories WHERE slug = 'home'),
    'Hand-thrown ceramic mug, 350ml. Each piece is unique. Made by local artisans in Thrissur. Microwave and dishwasher safe.',
    380,
    'exact',
    'available',
    true,
    true
  ),
  (
    'Premium Gift Hamper',
    'EK-GIFT-001',
    'ek-gift-001',
    (SELECT id FROM categories WHERE slug = 'gifts'),
    'Curated gift hamper with artisan chocolates, scented candles, and a handmade card. Perfect for birthdays, anniversaries, and celebrations.',
    1500,
    'on_request',
    'check_availability',
    true,
    true
  ),
  (
    'Personalised Keychain',
    'EK-ACC-001',
    'ek-acc-001',
    (SELECT id FROM categories WHERE slug = 'accessories'),
    'Customised metal keychain with name or initials engraved. Durable, polished finish. Order with your personalisation details.',
    250,
    'exact',
    'available',
    false,
    true
  ),
  (
    'Custom 3D Name Plate',
    'EK-3DP-001',
    'ek-3dp-001',
    (SELECT id FROM categories WHERE slug = '3d-products'),
    'Custom 3D-printed name plate for homes, offices, or gifts. Any name, any colour. Lead time: 3–5 working days after confirmation.',
    600,
    'approximate',
    'available',
    true,
    true
  ),
  (
    'Miniature Figurine (Custom)',
    'EK-3DP-002',
    'ek-3dp-002',
    (SELECT id FROM categories WHERE slug = '3d-products'),
    'Fully custom 3D-printed miniature figurine. Send a reference photo. Made to order by Kerala-based 3D print studio.',
    null,
    'on_request',
    'check_availability',
    false,
    true
  )
ON CONFLICT (code) DO NOTHING;

-- Update sequences based on seeded products
UPDATE product_code_sequences SET next_number = 3 WHERE code_prefix = 'TOY';
UPDATE product_code_sequences SET next_number = 3 WHERE code_prefix = 'FASH';
UPDATE product_code_sequences SET next_number = 3 WHERE code_prefix = 'ELEC';
UPDATE product_code_sequences SET next_number = 3 WHERE code_prefix = 'HOME';
UPDATE product_code_sequences SET next_number = 2 WHERE code_prefix = 'GIFT';
UPDATE product_code_sequences SET next_number = 2 WHERE code_prefix = 'ACC';
UPDATE product_code_sequences SET next_number = 3 WHERE code_prefix = '3DP';
