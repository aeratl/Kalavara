import { createClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/store/ProductGrid';
import type { Metadata } from 'next';
import type { Product } from '@/types';
import Link from 'next/link';
import { INITIAL_PRODUCTS } from '@/lib/mockData';


interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : 'Search',
    description: q ? `Search results for "${q}" on EE-KALAVARA.` : 'Search products on EE-KALAVARA.',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  if (!q?.trim()) {
    return (
      <div className="container-page" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '0.5rem' }}>Search</h1>
        <p style={{ color: 'var(--foreground-secondary)' }}>Enter a search term to find products.</p>
      </div>
    );
  }

  const query = q.trim().toLowerCase();
  let products: Product[] = INITIAL_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(query) ||
    p.code.toLowerCase().includes(query) ||
    (p.description && p.description.toLowerCase().includes(query)) ||
    (p.categories && p.categories.name.toLowerCase().includes(query))
  );

  try {
    const supabase = await createClient();
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*, categories(*), product_images(*)')
      .eq('is_published', true)
      .or(`code.ilike.%${query}%,name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(48);

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts as Product[];
    }
  } catch (err) {
    console.error('Search query fallback:', err);
  }

  return (
    <div className="container-page" style={{ padding: '3rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.875rem)', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          Results for &ldquo;{query}&rdquo;
        </h1>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem' }}>
          {products?.length || 0} product{products?.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <ProductGrid
        products={products as Product[] || []}
        emptyMessage={`No products found for "${query}". Try a different search term or browse by category.`}
      />

      {(!products || products.length === 0) && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/categories" className="btn btn-secondary">
            Browse Categories
          </Link>
        </div>
      )}
    </div>
  );
}
