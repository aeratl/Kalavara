// EE-KALAVARA — Shared TypeScript Types

export interface Category {
  id: string;
  name: string;
  slug: string;
  code_prefix: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Seller {
  id: string;
  business_name: string;
  contact_person: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  notes: string | null;
  status: 'pending' | 'verified' | 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  storage_path: string;
  public_url: string | null;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export type PriceDisplayMode = 'exact' | 'on_request' | 'approximate';
export type ProductAvailability = 'available' | 'check_availability' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  code: string;
  slug: string;
  category_id: string | null;
  seller_id: string | null;
  description: string | null;
  price: number | null;
  price_display_mode: PriceDisplayMode;
  availability: ProductAvailability;
  location: string | null;
  show_seller: boolean;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  categories?: Category | null;
  sellers?: Seller | null;
  product_images?: ProductImage[];
}

export type OrderStatus =
  | 'new'
  | 'contacted'
  | 'checking_availability'
  | 'price_confirmed'
  | 'payment_pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_request_id: string;
  product_id: string | null;
  product_code: string;
  product_name: string;
  quantity: number;
  price_at_order: number | null;
}

export interface OrderRequest {
  id: string;
  reference: string;
  customer_name: string;
  whatsapp: string;
  delivery_location: string;
  instagram: string | null;
  message: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  // Joined
  order_items?: OrderItem[];
}

export interface AdminNote {
  id: string;
  order_request_id: string;
  note: string;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

// Cart types (client-side only)
export interface CartItem {
  productId: string;
  productCode: string;
  productName: string;
  price: number | null;
  priceDisplayMode: PriceDisplayMode;
  quantity: number;
  imageUrl: string | null;
}

export interface Cart {
  items: CartItem[];
}

// Form types
export interface InformKalavaraFormData {
  name: string;
  whatsapp: string;
  delivery_location: string;
  instagram?: string;
  message?: string;
}

export interface ProductFormData {
  name: string;
  code: string;
  category_id: string;
  seller_id?: string;
  description: string;
  price?: number;
  price_display_mode: PriceDisplayMode;
  availability: ProductAvailability;
  location?: string;
  show_seller: boolean;
  is_featured: boolean;
  is_published: boolean;
}
