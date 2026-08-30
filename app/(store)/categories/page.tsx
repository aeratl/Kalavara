import { createClient } from '@/lib/supabase/server';
import CategoryCard from '@/components/store/CategoryCard';
import ProductGrid from '@/components/store/ProductGrid';
import type { Metadata } from 'next';
import type { Category, Product } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mockData';

export const metadata: Metadata = {
  title: 'All Categories',
  description: "Browse all product categories on EE-KALAVARA — toys, fashion, electronics, home, gifts, accessories, 3D products and more.",
};

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function CategoriesPage({ searchParams }: Props) {
  const { sort } = await searchParams;
  let categories: Category[] = INITIAL_CATEGORIES;
  let products: Product[] = INITIAL_PRODUCTS;

  try {
    const supabase = await createClient();
    const [{ data: dbCategories }, { data: dbProducts }] = await Promise.all([
      supabase.from('categories').select('*').eq('is_active', true).order('display_order'),
      supabase
        .from('products')
        .select('*, categories(*), product_images(*)')
        .eq('is_published', true)
        .order(sort === 'new' ? 'created_at' : 'name', { ascending: sort !== 'new' })
        .limit(24),
    ]);

    if (dbCategories && dbCategories.length > 0) categories = dbCategories as Category[];
    if (dbProducts && dbProducts.length > 0) products = dbProducts as Product[];
  } catch (err) {
    console.error('Categories fallback:', err);
  }

  return (
    <div className="container-page" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 400, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          {sort === 'new' ? 'New Arrivals' : 'All Categories'}
        </h1>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9375rem' }}>
          {sort === 'new' ? 'The latest additions to the catalogue.' : 'Browse everything we have.'}
        </p>
      </div>

      {/* Category cards */}
      {sort !== 'new' && (
        <div style={{ marginBottom: '4rem' }}>
          <p className="section-title" style={{ marginBottom: '1rem' }}>Categories</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '3rem',
            }}
          >
            {(categories as Category[] || []).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div>
        <p className="section-title" style={{ marginBottom: '1.5rem' }}>
          {sort === 'new' ? 'Latest Products' : 'All Products'}
        </p>
        <ProductGrid products={products as Product[] || []} />
      </div>
    </div>
  );
}
