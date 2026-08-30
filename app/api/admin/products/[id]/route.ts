import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { codeToSlug } from '@/lib/utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id]
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: product, error } = await admin
    .from('products')
    .select('*, categories(*), sellers(*), product_images(*)')
    .eq('id', id)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  code: z.string().optional(),
  category_id: z.string().optional().nullable(),
  seller_id: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional().nullable(),
  price_display_mode: z.enum(['exact', 'on_request', 'approximate']).optional(),
  availability: z.enum(['available', 'check_availability', 'out_of_stock']).optional(),
  location: z.string().optional().nullable(),
  show_seller: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
});

// PUT /api/admin/products/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const body = await request.json();
  const parsed = ProductUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const updateData: Record<string, any> = { ...parsed.data };
  if (parsed.data.code) {
    updateData.slug = codeToSlug(parsed.data.code);
  }

  const { data: updatedProduct, error } = await admin
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(updatedProduct);
}

// DELETE /api/admin/products/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin.from('products').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
