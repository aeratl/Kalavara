import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { z } from 'zod';

const OrderSchema = z.object({
  customer_name: z.string().min(1),
  whatsapp: z.string().min(10),
  delivery_location: z.string().min(1),
  instagram: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  items: z.array(z.object({
    product_id: z.string(),
    product_code: z.string(),
    product_name: z.string(),
    quantity: z.number().min(1),
    price_at_order: z.number().nullable().optional(),
  })).min(1),
});

async function getNextOrderReference(supabase: ReturnType<typeof createAdminClient>): Promise<string> {
  const year = new Date().getFullYear();

  // Use a transaction-safe approach: fetch and increment
  const { data: settings } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'order_reference_counter')
    .single();

  const counter = parseInt(settings?.value || '1', 10);
  const reference = `KL-${year}-${String(counter).padStart(4, '0')}`;

  // Increment counter
  await supabase
    .from('site_settings')
    .update({ value: String(counter + 1) })
    .eq('key', 'order_reference_counter');

  return reference;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = OrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { customer_name, whatsapp, delivery_location, instagram, message, items } = parsed.data;

    const reference = await getNextOrderReference(supabase);

    // Insert order request
    const { data: order, error: orderError } = await supabase
      .from('order_requests')
      .insert({
        reference,
        customer_name,
        whatsapp,
        delivery_location,
        instagram,
        message,
        status: 'new',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
    }

    // Insert order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(
        items.map((item) => ({
          order_request_id: order.id,
          product_id: item.product_id,
          product_code: item.product_code,
          product_name: item.product_name,
          quantity: item.quantity,
          price_at_order: item.price_at_order ?? null,
        }))
      );

    if (itemsError) {
      console.error('Order items insert error:', itemsError);
    }

    return NextResponse.json({ reference, orderId: order.id }, { status: 201 });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
}
