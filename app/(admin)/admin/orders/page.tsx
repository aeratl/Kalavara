'use client';

import { useState, useEffect } from 'react';
import OrderTable from '@/components/admin/OrderTable';
import type { OrderRequest, OrderStatus } from '@/types';

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Requests' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'checking_availability', label: 'Checking Availability' },
  { value: 'price_confirmed', label: 'Price Confirmed' },
  { value: 'payment_pending', label: 'Payment Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Order Requests
        </h1>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Customer inquiries submitted via &ldquo;Inform Kalavara&rdquo;
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        {/* Status Pills */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((f) => {
            const isActive = statusFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '100px',
                  border: `1px solid ${isActive ? 'var(--foreground)' : 'var(--border)'}`,
                  background: isActive ? 'var(--foreground)' : 'var(--background)',
                  color: isActive ? 'var(--background)' : 'var(--foreground-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input"
            style={{ width: '220px', padding: '0.4375rem 0.75rem', fontSize: '0.875rem' }}
            placeholder="Search ref, customer, phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary btn-sm">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="card" style={{ background: 'var(--background)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-tertiary)' }}>
            Loading order requests…
          </div>
        ) : (
          <OrderTable orders={orders} />
        )}
      </div>
    </div>
  );
}
