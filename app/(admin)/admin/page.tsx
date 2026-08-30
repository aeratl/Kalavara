import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import OrderTable from '@/components/admin/OrderTable';
import type { OrderRequest } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/lib/mockData';

export default async function AdminDashboardPage() {
  let totalProducts = INITIAL_PRODUCTS.length;
  let publishedProducts = INITIAL_PRODUCTS.filter((p) => p.is_published).length;
  let totalOrders = INITIAL_ORDERS.length;
  let newOrders = INITIAL_ORDERS.filter((o) => o.status === 'new').length;
  let recentOrders: OrderRequest[] = INITIAL_ORDERS;

  try {
    const supabase = await createClient();
    const [
      { count: dbTotalProducts },
      { count: dbPublishedProducts },
      { count: dbTotalOrders },
      { count: dbNewOrders },
      { data: dbRecentOrders },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('order_requests').select('*', { count: 'exact', head: true }),
      supabase.from('order_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase
        .from('order_requests')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    if (dbTotalProducts !== null && dbTotalProducts !== undefined) totalProducts = dbTotalProducts;
    if (dbPublishedProducts !== null && dbPublishedProducts !== undefined) publishedProducts = dbPublishedProducts;
    if (dbTotalOrders !== null && dbTotalOrders !== undefined) totalOrders = dbTotalOrders;
    if (dbNewOrders !== null && dbNewOrders !== undefined) newOrders = dbNewOrders;
    if (dbRecentOrders && dbRecentOrders.length > 0) recentOrders = dbRecentOrders as OrderRequest[];
  } catch (err) {
    console.error('Admin dashboard query fallback:', err);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--foreground)' }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Welcome to the EE-KALAVARA Admin Panel
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/products/new" className="btn btn-primary">
            + Add Product
          </Link>
          <Link href="/admin/orders" className="btn btn-secondary">
            View All Requests
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <StatCard
          title="New Requests"
          value={newOrders ?? 0}
          subtitle="Action needed"
          badgeColor="var(--red)"
          badgeBg="var(--red-bg)"
        />
        <StatCard
          title="Total Order Requests"
          value={totalOrders ?? 0}
          subtitle="All time inquiries"
        />
        <StatCard
          title="Published Products"
          value={publishedProducts ?? 0}
          subtitle="Live on storefront"
        />
        <StatCard
          title="Total Products"
          value={totalProducts ?? 0}
          subtitle="In catalogue"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--background)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Recent Order Requests</h2>
          <Link href="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', textDecoration: 'underline' }}>
            View all →
          </Link>
        </div>

        <OrderTable orders={(recentOrders as OrderRequest[]) || []} />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  badgeColor,
  badgeBg,
}: {
  title: string;
  value: number;
  subtitle: string;
  badgeColor?: string;
  badgeBg?: string;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--foreground-tertiary)' }}>
          {title}
        </p>
        <p style={{ fontSize: '2rem', fontWeight: 600, color: badgeColor || 'var(--foreground)', marginTop: '0.5rem', letterSpacing: '-0.03em' }}>
          {value}
        </p>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', marginTop: '0.75rem' }}>
        {subtitle}
      </p>
    </div>
  );
}
