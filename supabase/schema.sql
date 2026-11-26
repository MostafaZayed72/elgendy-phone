-- =========================================================================
-- مخطط قاعدة بيانات متجر الجندي للموبايلات (Supabase Schema)
-- انسخ هذا الكود بالكامل وضعه في SQL Editor داخل لوحة تحكم Supabase واضغط Run
-- =========================================================================

-- 1. جدول الأقسام والتصنيفات (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT DEFAULT 'smartphone',
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. جدول المنتجات (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category_slug TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  price NUMERIC(12, 2) DEFAULT 0,
  original_price NUMERIC(12, 2),
  unit_ar TEXT DEFAULT 'قطعة',
  unit_en TEXT DEFAULT 'piece',
  image TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  badge_ar TEXT,
  badge_en TEXT,
  colors JSONB DEFAULT '[]'::jsonb,
  color_images JSONB DEFAULT '{}'::jsonb,
  options JSONB DEFAULT '[]'::jsonb,
  is_hidden BOOLEAN DEFAULT false,
  is_out_of_stock BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- الترقية التلقائية في حال كان الجدول منشأ مسبقاً
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_images JSONB DEFAULT '{}'::jsonb;

-- فهارس لتحسين سرعة الاستعلام
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_slug);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products (created_at DESC);

-- تمكين سياسات الأمان (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- سياسات القراءة العامة للزوار
DROP POLICY IF EXISTS "Allow public read categories" ON public.categories;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read products" ON public.products;
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);

-- سياسات الكتابة (يتم تنفيذها عبر السيرفر باستخدام Service Role أو من لوحة التحكم)
DROP POLICY IF EXISTS "Allow all write categories" ON public.categories;
CREATE POLICY "Allow all write categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all write products" ON public.products;
CREATE POLICY "Allow all write products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- منح صلاحيات الوصول الكاملة للجداول في قاعدة البيانات
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
