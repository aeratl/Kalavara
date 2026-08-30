import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PriceDisplayMode, ProductAvailability } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price for display */
export function formatPrice(price: number | null, mode: PriceDisplayMode): string {
  if (mode === 'on_request' || price === null) return 'Price on Request';
  if (mode === 'approximate') return `~₹${price.toLocaleString('en-IN')}`;
  return `₹${price.toLocaleString('en-IN')}`;
}

/** Return availability label and colour key */
export function getAvailabilityInfo(availability: ProductAvailability): {
  label: string;
  color: 'green' | 'yellow' | 'red';
} {
  switch (availability) {
    case 'available':
      return { label: 'Available', color: 'green' };
    case 'check_availability':
      return { label: 'Check Availability', color: 'yellow' };
    case 'out_of_stock':
      return { label: 'Out of Stock', color: 'red' };
  }
}

/** Generate a WhatsApp URL with pre-filled message */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  const number = clean.startsWith('91') ? clean : `91${clean}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Generate order reference: KL-YYYY-NNNN */
export function generateOrderReference(year: number, counter: number): string {
  return `KL-${year}-${String(counter).padStart(4, '0')}`;
}

/** Generate product code: EK-PREFIX-NNN */
export function generateProductCode(prefix: string, number: number): string {
  return `EK-${prefix}-${String(number).padStart(3, '0')}`;
}

/** Generate product slug from code */
export function codeToSlug(code: string): string {
  return code.toLowerCase();
}

/** Truncate text to max length */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

/** Get primary image URL from product images array */
export function getPrimaryImageUrl(images?: Array<{ is_primary: boolean; public_url: string | null; display_order: number }>): string | null {
  if (!images || images.length === 0) return null;
  const primary = images.find((img) => img.is_primary);
  if (primary?.public_url) return primary.public_url;
  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  return sorted[0]?.public_url ?? null;
}

/** Validate Indian mobile number */
export function isValidIndianMobile(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(clean) || /^91[6-9]\d{9}$/.test(clean);
}
