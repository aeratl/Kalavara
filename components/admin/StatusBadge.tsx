import type { OrderStatus } from '@/types';

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'status-new' },
  contacted: { label: 'Contacted', className: 'status-contacted' },
  checking_availability: { label: 'Checking Availability', className: 'status-checking_availability' },
  price_confirmed: { label: 'Price Confirmed', className: 'status-price_confirmed' },
  payment_pending: { label: 'Payment Pending', className: 'status-payment_pending' },
  paid: { label: 'Paid', className: 'status-paid' },
  processing: { label: 'Processing', className: 'status-processing' },
  shipped: { label: 'Shipped', className: 'status-shipped' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
  cancelled: { label: 'Cancelled', className: 'status-cancelled' },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const info = STATUS_MAP[status] || { label: status, className: 'badge-gray' };

  return (
    <span
      className={`badge ${info.className}`}
      style={{
        padding: '0.25rem 0.625rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '100px',
        letterSpacing: '0.03em',
        textTransform: 'capitalize',
      }}
    >
      {info.label}
    </span>
  );
}
