'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_number: '9400634966',
    contact_email: 'eekalavara@gmail.com',
    instagram_url: 'https://instagram.com/eekalavara',
    order_reference_prefix: 'KL',
    site_name: 'EE-KALAVARA',
    tagline: "Kerala's Digital Chandha",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.settings && Object.keys(data.settings).length > 0) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          Store Settings
        </h1>
        <p style={{ color: 'var(--foreground-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Configure WhatsApp numbers, contact emails, and marketplace details
        </p>
      </div>

      {success && (
        <div style={{ padding: '0.875rem 1rem', background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 'var(--radius)', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          ✓ Settings saved successfully!
        </div>
      )}

      <div className="card" style={{ padding: '2rem', background: 'var(--background)' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings…</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="label">Official WhatsApp Number *</label>
              <input
                type="tel"
                className="input"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="9400634966"
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--foreground-tertiary)', marginTop: '0.25rem', display: 'block' }}>
                Customer &ldquo;Inform Kalavara&rdquo; links and seller contact buttons will route to this number.
              </span>
            </div>

            <div>
              <label className="label">Contact Email *</label>
              <input
                type="email"
                className="input"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="eekalavara@gmail.com"
                required
              />
            </div>

            <div>
              <label className="label">Instagram Profile URL</label>
              <input
                type="url"
                className="input"
                value={settings.instagram_url}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                placeholder="https://instagram.com/eekalavara"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Order Prefix</label>
                <input
                  type="text"
                  className="input"
                  value={settings.order_reference_prefix}
                  onChange={(e) => setSettings({ ...settings, order_reference_prefix: e.target.value.toUpperCase() })}
                  placeholder="KL"
                  required
                />
              </div>
              <div>
                <label className="label">Site Name</label>
                <input
                  type="text"
                  className="input"
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  placeholder="EE-KALAVARA"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Tagline</label>
              <input
                type="text"
                className="input"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Kerala's Digital Chandha"
                required
              />
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                {saving ? 'Saving Settings…' : 'Save Settings'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
