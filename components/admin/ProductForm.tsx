'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader, { UploadedImage } from './ImageUploader';
import type { Category, Seller, Product, PriceDisplayMode, ProductAvailability } from '@/types';

interface ProductFormProps {
  initialProduct?: Product;
  categories: Category[];
  sellers: Seller[];
}

export default function ProductForm({ initialProduct, categories, sellers }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [images, setImages] = useState<UploadedImage[]>(
    initialProduct?.product_images
      ? initialProduct.product_images.map((img) => ({
          id: img.id,
          storage_path: img.storage_path,
          public_url: img.public_url || '',
          is_primary: img.is_primary,
        }))
      : []
  );

  const [form, setForm] = useState({
    name: initialProduct?.name || '',
    code: initialProduct?.code || '',
    category_id: initialProduct?.category_id || (categories[0]?.id || ''),
    seller_id: initialProduct?.seller_id || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price !== null && initialProduct?.price !== undefined ? String(initialProduct.price) : '',
    price_display_mode: (initialProduct?.price_display_mode || 'exact') as PriceDisplayMode,
    availability: (initialProduct?.availability || 'available') as ProductAvailability,
    location: initialProduct?.location || '',
    show_seller: initialProduct?.show_seller || false,
    is_featured: initialProduct?.is_featured || false,
    is_published: initialProduct !== undefined ? initialProduct.is_published : true,
  });

  // Auto-suggest next product code when category changes if creating new product
  useEffect(() => {
    if (!initialProduct && form.category_id) {
      const selectedCat = categories.find((c) => c.id === form.category_id);
      if (selectedCat && !form.code) {
        // Auto prefill template or leave empty so backend generates next sequence
        // or generate temporary preview code
        setForm((f) => ({
          ...f,
          code: `EK-${selectedCat.code_prefix}-001`,
        }));
      }
    }
  }, [form.category_id, categories, initialProduct]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value;
    const selectedCat = categories.find((c) => c.id === newCatId);
    setForm((f) => ({
      ...f,
      category_id: newCatId,
      code: !initialProduct && selectedCat ? `EK-${selectedCat.code_prefix}-001` : f.code,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }

    if (!form.category_id) {
      setError('Please select a category.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim() || undefined,
        category_id: form.category_id,
        seller_id: form.seller_id || null,
        description: form.description.trim() || null,
        price: form.price ? parseFloat(form.price) : null,
        price_display_mode: form.price_display_mode,
        availability: form.availability,
        location: form.location.trim() || null,
        show_seller: form.show_seller,
        is_featured: form.is_featured,
        is_published: form.is_published,
      };

      const url = initialProduct
        ? `/api/admin/products/${initialProduct.id}`
        : '/api/admin/products';

      const method = initialProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      // If there are uploaded images for a new product, we can link them
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      console.error('Product save error:', err);
      setError(err.message || 'Something went wrong while saving product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {error && (
        <div style={{ padding: '0.875rem 1rem', background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Main Info Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Basic Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {/* Product Name */}
          <div>
            <label className="label" htmlFor="prod-name">Product Name *</label>
            <input
              id="prod-name"
              type="text"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Remote Control Toy Car"
              required
            />
          </div>

          {/* Category & Product Code */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="label" htmlFor="prod-cat">Category *</label>
              <select
                id="prod-cat"
                className="input"
                value={form.category_id}
                onChange={handleCategoryChange}
                required
              >
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code_prefix})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="prod-code">Product Code (EK-PREFIX-NUM) *</label>
              <input
                id="prod-code"
                type="text"
                className="input"
                style={{ fontFamily: 'var(--font-mono)' }}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. EK-TOY-001"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--foreground-tertiary)', marginTop: '0.25rem', display: 'block' }}>
                Format: EK-[CATEGORY]-[NUMBER] (Must be unique)
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="prod-desc">Description</label>
            <textarea
              id="prod-desc"
              className="input"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the product, materials, sizing, features, lead time, etc."
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Availability Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Pricing & Status
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {/* Price */}
          <div>
            <label className="label" htmlFor="prod-price">Price (₹ INR)</label>
            <input
              id="prod-price"
              type="number"
              step="any"
              min="0"
              className="input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="750"
            />
          </div>

          {/* Price Display Mode */}
          <div>
            <label className="label" htmlFor="prod-price-mode">Price Display Mode</label>
            <select
              id="prod-price-mode"
              className="input"
              value={form.price_display_mode}
              onChange={(e) => setForm({ ...form, price_display_mode: e.target.value as PriceDisplayMode })}
            >
              <option value="exact">Exact Price (₹750)</option>
              <option value="approximate">Approximate Price (~₹750)</option>
              <option value="on_request">Price on Request</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="label" htmlFor="prod-avail">Availability</label>
            <select
              id="prod-avail"
              className="input"
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value as ProductAvailability })}
            >
              <option value="available">Available</option>
              <option value="check_availability">Check Availability</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Images Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Product Images
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-secondary)', marginBottom: '1.25rem' }}>
          Upload high quality photos. First image or cover image will be displayed on category listings.
        </p>

        <ImageUploader
          images={images}
          onChange={setImages}
          productId={initialProduct?.id}
        />
      </div>

      {/* Seller & Sourcing Card */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Seller & Sourcing (Internal)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="label" htmlFor="prod-seller">Seller / Source</label>
            <select
              id="prod-seller"
              className="input"
              value={form.seller_id}
              onChange={(e) => setForm({ ...form, seller_id: e.target.value })}
            >
              <option value="">None / Kalavara In-house</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.business_name} {s.location ? `(${s.location})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="prod-loc">Location</label>
            <input
              id="prod-loc"
              type="text"
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Thrissur, Kerala"
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            id="prod-show-seller"
            type="checkbox"
            checked={form.show_seller}
            onChange={(e) => setForm({ ...form, show_seller: e.target.checked })}
            style={{ width: '16px', height: '16px' }}
          />
          <label htmlFor="prod-show-seller" style={{ fontSize: '0.875rem', color: 'var(--foreground-secondary)', cursor: 'pointer' }}>
            Show seller business name publicly on product page
          </label>
        </div>
      </div>

      {/* Visibility & Publishing */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 600, marginBottom: '1.25rem' }}>
          Catalogue Visibility
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)' }}>
                Published to Store
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>
                Make this product visible and searchable to customers on EE-KALAVARA
              </p>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              style={{ width: '18px', height: '18px' }}
            />
            <div>
              <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)' }}>
                Featured Product
              </span>
              <p style={{ fontSize: '0.8125rem', color: 'var(--foreground-tertiary)' }}>
                Highlight this product in the homepage Featured section
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving Product…' : initialProduct ? 'Save Changes' : 'Publish Product'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="btn btn-secondary btn-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
