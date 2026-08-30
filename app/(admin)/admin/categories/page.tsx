'use client';

import { useState, useEffect } from 'react';
import type { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({
    name: '',
    slug: '',
    code_prefix: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const prefix = name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    setNewCat({
      ...newCat,
      name,
      slug,
      code_prefix: prefix,
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.code_prefix) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCat,
          display_order: categories.length + 1,
          is_active: true,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewCat({ name: '', slug: '', code_prefix: '', description: '' });
        fetchCategories();
      }
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
            Categories
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage product categories and product code prefixes (e.g. EK-TOY-001)
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          + Add Category
        </button>
      </div>

      <div className="card" style={{ background: 'var(--background)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-tertiary)' }}>
            Loading categories…
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Category Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Code Prefix</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Slug</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Example Code</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--foreground)' }}>
                    {c.name}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {c.code_prefix}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--foreground-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                    /categories/{c.slug}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--foreground-tertiary)', fontSize: '0.8125rem' }}>
                    EK-{c.code_prefix}-001
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${c.is_active ? 'badge-green' : 'badge-gray'}`}>
                      {c.is_active ? 'Active' : 'Disabled'}
                    </span>
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
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', background: 'var(--background)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem' }}>Add Category</h2>

            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Category Name</label>
                <input
                  type="text"
                  className="input"
                  value={newCat.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Handicrafts"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Code Prefix</label>
                  <input
                    type="text"
                    className="input"
                    value={newCat.code_prefix}
                    onChange={(e) => setNewCat({ ...newCat, code_prefix: e.target.value.toUpperCase() })}
                    placeholder="e.g. CRAFT"
                    required
                  />
                </div>
                <div>
                  <label className="label">URL Slug</label>
                  <input
                    type="text"
                    className="input"
                    value={newCat.slug}
                    onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
                    placeholder="e.g. handicrafts"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  rows={2}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  placeholder="Short category description for customers"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
