'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Seller } from '@/types';

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    whatsapp: '',
    location: '',
    notes: '',
    status: 'active' as 'pending' | 'verified' | 'active' | 'inactive',
  });

  const fetchSellers = async () => {
    try {
      const res = await fetch('/api/admin/sellers');
      const data = await res.json();
      if (data.sellers) setSellers(data.sellers);
    } catch (err) {
      console.error('Failed to fetch sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleAddSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_name.trim()) return;

    try {
      const res = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowAddModal(false);
        setForm({
          business_name: '',
          contact_person: '',
          phone: '',
          whatsapp: '',
          location: '',
          notes: '',
          status: 'active',
        });
        fetchSellers();
      }
    } catch (err) {
      console.error('Failed to save seller:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Sellers & Sources
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Maintain supplier directory, offline shops, and artisan contacts
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          + Add Seller
        </button>
      </div>

      <div className="card" style={{ background: 'var(--background)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-tertiary)' }}>
            Loading sellers…
          </div>
        ) : sellers.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--foreground-tertiary)' }}>
            <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No sellers registered yet.</p>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">Add First Seller</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Business Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Contact Person</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Phone / WhatsApp</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Location</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--foreground)' }}>
                    <Link href={`/admin/sellers/${s.id}`} style={{ textDecoration: 'underline' }}>
                      {s.business_name}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--foreground-secondary)' }}>
                    {s.contact_person || '—'}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)' }}>
                    {s.whatsapp || s.phone || '—'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--foreground-secondary)' }}>
                    {s.location || '—'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      className={`badge ${
                        s.status === 'active'
                          ? 'badge-green'
                          : s.status === 'verified'
                          ? 'badge-yellow'
                          : 'badge-gray'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <Link href={`/admin/sellers/${s.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', background: 'var(--background)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Seller / Source</h2>

            <form onSubmit={handleAddSeller} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Business Name *</label>
                <input
                  type="text"
                  className="input"
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  placeholder="e.g. ABC Toys & Gifts"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Contact Person</label>
                  <input
                    type="text"
                    className="input"
                    value={form.contact_person}
                    onChange={(e) => setForm({ ...form, contact_person: e.target.value })}
                    placeholder="e.g. Rajesh Kumar"
                  />
                </div>
                <div>
                  <label className="label">WhatsApp Number</label>
                  <input
                    type="tel"
                    className="input"
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="9400XXXXXX"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    className="input"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Thrissur, Kerala"
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
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Wholesale margin, delivery lead time, bank details..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
