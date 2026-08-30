'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import type { OrderRequest, OrderStatus, AdminNote } from '@/types';
import { buildWhatsAppUrl, formatPrice } from '@/lib/utils';

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: '1. New Request' },
  { value: 'contacted', label: '2. Contacted Customer' },
  { value: 'checking_availability', label: '3. Checking Availability with Source' },
  { value: 'price_confirmed', label: '4. Price Confirmed' },
  { value: 'payment_pending', label: '5. Payment Pending / QR Sent' },
  { value: 'paid', label: '6. Payment Received' },
  { value: 'processing', label: '7. Processing / Sourcing Product' },
  { value: 'shipped', label: '8. Shipped / Out for Delivery' },
  { value: 'delivered', label: '9. Delivered Successfully' },
  { value: 'cancelled', label: '10. Cancelled' },
];

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderRequest | null>(null);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        setNotes(data.admin_notes || []);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotes([data, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading order details…</div>;
  }

  if (!order) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Order not found.</div>;
  }

  const waMessage = `Hello ${order.customer_name}! This is the EE-KALAVARA team regarding your order request ${order.reference}. We have verified your requested products and would like to confirm availability and payment details.`;
  const waUrl = buildWhatsAppUrl(order.whatsapp, waMessage);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/orders" style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          ← Back to All Requests
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>
              {order.reference}
            </h1>
            <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Submitted on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <StatusBadge status={order.status} />
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Customer Details & Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Customer Card */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--background)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Customer Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p className="label">Customer Name</p>
                <p style={{ fontWeight: 500, color: 'var(--foreground)' }}>{order.customer_name}</p>
              </div>
              <div>
                <p className="label">WhatsApp Number</p>
                <p style={{ fontWeight: 500, color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>{order.whatsapp}</p>
              </div>
              <div>
                <p className="label">Delivery Location</p>
                <p style={{ color: 'var(--foreground)' }}>{order.delivery_location}</p>
              </div>
              <div>
                <p className="label">Instagram</p>
                <p style={{ color: 'var(--foreground)' }}>{order.instagram || '—'}</p>
              </div>
            </div>

            {order.message && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <p className="label">Customer Message</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', background: 'var(--surface)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                  &ldquo;{order.message}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Requested Items Card */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--background)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Requested Products</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(order.order_items || []).map((item) => (
                <div
                  key={item.id || item.product_code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', display: 'block' }}>
                      {item.product_code}
                    </span>
                    <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                      {item.product_name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      × {item.quantity}
                    </span>
                    {item.price_at_order && (
                      <span style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--foreground-secondary)' }}>
                        ₹{item.price_at_order} each
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Status & Internal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Update Card */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--background)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Order Status Workflow</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', marginBottom: '1rem' }}>
              Update the order status as you progress with supplier verification and fulfillment.
            </p>

            <div>
              <label className="label" htmlFor="order-status-select">Current Stage</label>
              <select
                id="order-status-select"
                className="input"
                value={order.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                style={{ fontWeight: 600 }}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Internal Notes Card */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--background)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Internal Admin Notes</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', marginBottom: '1rem' }}>
              Private notes for Kalavara team (e.g. &ldquo;Called ABC Toys. Product available. Dealer price ₹600.&rdquo;)
            </p>

            <form onSubmit={handleAddNote} style={{ marginBottom: '1.25rem' }}>
              <textarea
                className="input"
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add an internal note or dealer quote…"
                style={{ resize: 'vertical', marginBottom: '0.5rem' }}
                required
              />
              <button
                type="submit"
                className="btn btn-secondary btn-sm"
                disabled={savingNote || !newNote.trim()}
              >
                {savingNote ? 'Adding Note…' : '+ Add Note'}
              </button>
            </form>

            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notes.length === 0 ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', fontStyle: 'italic' }}>
                  No internal notes recorded yet.
                </p>
              ) : (
                notes.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      background: 'var(--surface)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: '1.5' }}>
                      {n.note}
                    </p>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--foreground-tertiary)', marginTop: '0.25rem', display: 'block' }}>
                      {new Date(n.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
