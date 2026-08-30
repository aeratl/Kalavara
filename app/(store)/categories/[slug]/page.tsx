import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/store/ProductGrid';
import type { Metadata } from 'next';
import type { Category, Product } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/lib/mockData';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let cat = INITIAL_CATEGORIES.find((c) => c.slug === slug);
  try {
    const supabase = await createClient();
    const { data: dbCat } = await supabase.from('categories').select('name, description').eq('slug', slug).single();
    if (dbCat) cat = dbCat as any;
  } catch {}
  if (!cat) return { title: 'Category Not Found' };
  return {
    title: cat.name,
    description: cat.description || `Browse ${cat.name} products on EE-KALAVARA.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let category: Category | undefined = INITIAL_CATEGORIES.find((c) => c.slug === slug);
  let catProducts: Product[] = INITIAL_PRODUCTS.filter((p) => p.categories?.slug === slug);

  try {
    const supabase = await createClient();
    const { data: dbCat } = await supabase.from('categories').select('*').eq('slug', slug).single();
    if (dbCat) {
      category = dbCat as Category;
      const { data: dbProducts } = await supabase
        .from('products')
        .select('*, categories(*), product_images(*)')
        .eq('is_published', true)
        .eq('category_id', dbCat.id)
        .order('created_at', { ascending: false });

      if (dbProducts && dbProducts.length > 0) {
        catProducts = dbProducts as Product[];
      }
    }
  } catch (err) {
    console.error('Category slug fallback:', err);
  }

  if (!category) notFound();

  return (
    <div className="container-page" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', maxWidth: '480px' }}>
        <p className="product-code" style={{ marginBottom: '0.5rem' }}>
          {(category as Category).code_prefix}
        </p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 400, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          {(category as Category).name}
        </h1>
        {(category as Category).description && (
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.9375rem', lineHeight: '1.7' }}>
            {(category as Category).description}
          </p>
        )}
        <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', marginTop: '0.5rem' }}>
          {catProducts?.length || 0} product{catProducts?.length !== 1 ? 's' : ''}
        </p>
      </div>

      <ProductGrid
        products={catProducts as Product[] || []}
        emptyMessage={`No products in ${(category as Category).name} yet. Check back soon!`}
      />
    </div>
  );
}
