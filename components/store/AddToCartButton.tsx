'use client';

import { useCart } from '@/hooks/useCart';
import { getPrimaryImageUrl } from '@/lib/utils';
import type { Product } from '@/types';

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);

  const handleAdd = () => {
    const imageUrl = getPrimaryImageUrl(product.product_images);
    addItem({
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      price: product.price,
      priceDisplayMode: product.price_display_mode,
      imageUrl,
    });
  };

  if (product.availability === 'out_of_stock') {
    return (
      <button disabled className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed' }}>
        Out of Stock
      </button>
    );
  }

  return (
    <button onClick={handleAdd} className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
      Add to Cart
    </button>
  );
}
