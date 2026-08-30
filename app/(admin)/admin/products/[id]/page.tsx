import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import type { Category, Seller, Product } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_SELLERS, INITIAL_PRODUCTS } from '@/lib/mockData';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  let product: Product | undefined = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id || p.code === id);
  let categories: Category[] = INITIAL_CATEGORIES;
  let sellers: Seller[] = INITIAL_SELLERS;

  try {
    const supabase = await createClient();
    const [
      { data: dbProduct },
      { data: dbCategories },
      { data: dbSellers },
    ] = await Promise.all([
      supabase
        .from('products')
        .select('*, categories(*), sellers(*), product_images(*)')
        .eq('id', id)
        .single(),
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('sellers').select('*').order('business_name'),
    ]);

    if (dbProduct) product = dbProduct as Product;
    if (dbCategories && dbCategories.length > 0) categories = dbCategories as Category[];
    if (dbSellers && dbSellers.length > 0) sellers = dbSellers as Seller[];
  } catch (err) {
    console.error('Admin edit product fallback:', err);
  }

  if (!product) notFound();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          ← Back to Products
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Edit Product: {(product as Product).name}
        </h1>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
          {(product as Product).code}
        </p>
      </div>

      <ProductForm
        initialProduct={product as Product}
        categories={(categories as Category[]) || []}
        sellers={(sellers as Seller[]) || []}
      />
    </div>
  );
}
