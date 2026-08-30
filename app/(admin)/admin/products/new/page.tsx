import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import Link from 'next/link';
import type { Category, Seller } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_SELLERS } from '@/lib/mockData';

export default async function AddProductPage() {
  let categories: Category[] = INITIAL_CATEGORIES;
  let sellers: Seller[] = INITIAL_SELLERS;

  try {
    const supabase = await createClient();
    const [{ data: dbCategories }, { data: dbSellers }] = await Promise.all([
      supabase.from('categories').select('*').order('display_order'),
      supabase.from('sellers').select('*').order('business_name'),
    ]);

    if (dbCategories && dbCategories.length > 0) categories = dbCategories as Category[];
    if (dbSellers && dbSellers.length > 0) sellers = dbSellers as Seller[];
  } catch (err) {
    console.error('Admin add product fallback:', err);
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/products" style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          ← Back to Products
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Add New Product
        </h1>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Create a new listing in the EE-KALAVARA catalogue. Add details and publish immediately.
        </p>
      </div>

      <ProductForm
        categories={(categories as Category[]) || []}
        sellers={(sellers as Seller[]) || []}
      />
    </div>
  );
}
