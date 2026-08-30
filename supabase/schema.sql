-- ============================================================
-- EE-KALAVARA — Kerala's Digital Chandha
-- Full Database Schema for Supabase PostgreSQL
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  code_prefix TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SELLERS
-- ============================================================
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  whatsapp TEXT,
  location TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
  description TEXT,
  price DECIMAL(10,2),
  price_display_mode TEXT DEFAULT 'exact' CHECK (price_display_mode IN ('exact', 'on_request', 'approximate')),
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'check_availability', 'out_of_stock')),
  location TEXT,
  show_seller BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCT CODE SEQUENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_code_sequences (
  code_prefix TEXT PRIMARY KEY,
  next_number INT DEFAULT 1
);

-- ============================================================
-- ORDER REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  instagram TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (
    status IN (
      'new', 'contacted', 'checking_availability',
      'price_confirmed', 'payment_pending', 'paid',
      'processing', 'shipped', 'delivered', 'cancelled'
    )
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_request_id UUID REFERENCES order_requests(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price_at_order DECIMAL(10,2)
);

-- ============================================================
-- ADMIN NOTES (Internal)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_request_id UUID REFERENCES order_requests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SITE SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN PROFILES (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEFAULT SITE SETTINGS
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '9400634966'),
  ('contact_email', 'eekalavara@gmail.com'),
  ('instagram_url', 'https://instagram.com/eekalavara'),
  ('order_reference_prefix', 'KL'),
  ('order_reference_counter', '1'),
  ('site_name', 'EE-KALAVARA'),
  ('tagline', 'Kerala''s Digital Chandha')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sellers_updated_at BEFORE UPDATE ON sellers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER order_requests_updated_at BEFORE UPDATE ON order_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Categories: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products: public read published, admin all
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_published = true);
CREATE POLICY "products_admin_all" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Product Images: public read, admin write
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_images_public_read" ON product_images FOR SELECT USING (true);
CREATE POLICY "product_images_admin_all" ON product_images FOR ALL USING (auth.role() = 'authenticated');

-- Sellers: admin only
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sellers_admin_all" ON sellers FOR ALL USING (auth.role() = 'authenticated');

-- Order Requests: insert public, read/update admin
ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_public_insert" ON order_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_admin_all" ON order_requests FOR ALL USING (auth.role() = 'authenticated');

-- Order Items: insert public, read/update admin
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items_public_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_admin_all" ON order_items FOR ALL USING (auth.role() = 'authenticated');

-- Admin Notes: admin only
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_notes_admin_all" ON admin_notes FOR ALL USING (auth.role() = 'authenticated');

-- Product Code Sequences: admin only
ALTER TABLE product_code_sequences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sequences_admin_all" ON product_code_sequences FOR ALL USING (auth.role() = 'authenticated');

-- Site Settings: public read, admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Admin Profiles: admin only
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_profiles_admin_all" ON admin_profiles FOR ALL USING (auth.role() = 'authenticated');
