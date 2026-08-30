'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Seller } from '@/types';

export default function EditSellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    whatsapp: '',
    location: '',
    notes: '',
    status: 'active' as 'pending' | 'verified' | 'active' | 'inactive',
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/sellers/${id}`);
        const data = await res.json();
        if (res.ok) {
          setSeller(data);
          setForm({
            business_name: data.business_name || '',
            contact_person: data.contact_person || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            location: data.location || '',
            notes: data.notes || '',
            status: data.status || 'active',
          });
        }
      } catch (err) {
        console.error('Failed to load seller:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sellers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/sellers');
      }
    } catch (err) {
      console.error('Failed to update seller:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this seller?')) return;
    try {
      const res = await fetch(`/api/admin/sellers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/sellers');
      }
    } catch (err) {
      console.error('Failed to delete seller:', err);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading seller details…</div>;
  }

  if (!seller) {
    return <div style={{ padding: '3rem', textAlign: 'center' }}>Seller not found.</div>;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/sellers" style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
          ← Back to Sellers
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Edit Seller: {seller.business_name}
        </h1>
      </div>

      <div className="card" style={{ padding: '2rem', background: 'var(--background)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="label">Business Name *</label>
            <input
              type="text"
              className="input"
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Contact Person</label>
              <input
                type="text"
                className="input"
                value={form.contact_person}
                onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
              />
            </div>
            <div>
              <label className="label">WhatsApp Number</label>
              <input
                type="tel"
                className="input"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Location</label>
              <input
                type="text"
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Internal Notes / Deal Terms</label>
            <textarea
              className="input"
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{ color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Delete Seller
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => router.push('/admin/sellers')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
