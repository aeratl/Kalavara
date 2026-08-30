import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/store/ProductGrid';
import CategoryCard from '@/components/store/CategoryCard';
import BrandedAds from '@/components/store/BrandedAds';
import HomeHero from '@/components/store/HomeHero';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { Category, Product } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mockData';

export const metadata: Metadata = {
  title: "Ee Kalavara — Kerala's Digital Chandha",
  description: "Discover curated products from Kerala's best local shops, designers, and makers. Browse toys, fashion, electronics, home goods, gifts, and more.",
};

export default async function HomePage() {
  let categories: Category[] = INITIAL_CATEGORIES;
  let featuredProducts: Product[] = INITIAL_PRODUCTS.filter((p) => p.is_featured);
  let newArrivals: Product[] = INITIAL_PRODUCTS;

  try {
    const supabase = await createClient();
    const [{ data: dbCategories }, { data: dbFeatured }, { data: dbNewArrivals }] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order'),
      supabase
        .from('products')
        .select('*, categories(*), product_images(*)')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8),
      supabase
        .from('products')
        .select('*, categories(*), product_images(*)')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(12),
    ]);

    if (dbCategories && dbCategories.length > 0) categories = dbCategories as Category[];
    if (dbFeatured && dbFeatured.length > 0) featuredProducts = dbFeatured as Product[];
    if (dbNewArrivals && dbNewArrivals.length > 0) newArrivals = dbNewArrivals as Product[];
  } catch (err) {
    console.error('Database query fallback:', err);
  }

  return (
    <>
      {/* ── Full-screen Home Hero ─────────────────────────────────── */}
      <HomeHero />

      {/* ── Categories ───────────────────────────────────────────── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container-page">
          <div className="section-header">
            <h2 className="section-title">Categories</h2>
            <Link href="/categories" style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)' }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
            {(categories as Category[] || []).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────────── */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container-page">
            <div className="section-header">
              <h2 className="section-title">Featured</h2>
            </div>
            <ProductGrid products={featuredProducts as Product[]} />
          </div>
        </section>
      )}

      {/* ── Branded Ads ──────────────────────────────────────────── */}
      <BrandedAds />

      {/* ── New Arrivals ─────────────────────────────────────────── */}
      {newArrivals && newArrivals.length > 0 && (
        <section style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container-page">
            <div className="section-header">
              <h2 className="section-title">New Arrivals</h2>
              <Link href="/categories" style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)' }}>
                Browse all →
              </Link>
            </div>
            <ProductGrid products={newArrivals as Product[]} />
          </div>
        </section>
      )}

      {/* ── Sell on Kalavara ─────────────────────────────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '5rem 0', background: 'var(--surface)' }}>
        <div className="container-page" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--foreground-tertiary)', marginBottom: '1rem' }}>
            For Sellers
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Want to list your products on Kerala&apos;s Digital Chandha?
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--foreground-secondary)', lineHeight: '1.7', marginBottom: '2rem' }}>
            From local shops to independent makers — Kalavara showcases the best. Contact us to get your products listed.
          </p>
          <Link href="/sell" className="btn btn-primary">Contact Kalavara</Link>
        </div>
      </section>
    </>
  );
}
