'use client';

import Link from 'next/link';
import StatusBadge from './StatusBadge';
import type { OrderRequest, OrderStatus } from '@/types';
import { buildWhatsAppUrl } from '@/lib/utils';

interface OrderTableProps {
  orders: OrderRequest[];
  onStatusChange?: (orderId: string, newStatus: OrderStatus) => void;
}

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--foreground-tertiary)' }}>
        No order requests found.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Reference</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Customer</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>WhatsApp</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Location</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Items</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)' }}>Status</th>
            <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--foreground-secondary)', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const waUrl = buildWhatsAppUrl(
              order.whatsapp,
              `Hello ${order.customer_name}, this is the Kalavara team regarding your request ${order.reference}.`
            );

            return (
              <tr
                key={order.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Reference */}
                <td style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--foreground)' }}>
                  <Link href={`/admin/orders/${order.id}`} style={{ textDecoration: 'underline' }}>
                    {order.reference}
                  </Link>
                </td>

                {/* Customer */}
                <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--foreground)' }}>
                  {order.customer_name}
                  {order.instagram && (
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--foreground-tertiary)' }}>
                      @{order.instagram.replace('@', '')}
                    </span>
                  )}
                </td>

                {/* WhatsApp */}
                <td style={{ padding: '1rem' }}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      color: 'var(--green)',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    <span>{order.whatsapp}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  </a>
                </td>

                {/* Location */}
                <td style={{ padding: '1rem', color: 'var(--foreground-secondary)' }}>
                  {order.delivery_location}
                </td>

                {/* Items */}
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {(order.order_items || []).map((item) => (
                      <span key={item.id || item.product_code} style={{ fontSize: '0.8125rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--foreground-tertiary)' }}>
                          {item.product_code}
                        </span>{' '}
                        × {item.quantity}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: '1rem' }}>
                  <StatusBadge status={order.status} />
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
