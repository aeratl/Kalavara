import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { generateProductCode, codeToSlug } from '@/lib/utils';

// GET /api/admin/products — list all products (admin)
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const { data: products, count, error } = await admin
    .from('products')
    .select('*, categories(*), sellers(*), product_images(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ products, count, page, limit });
}

const ProductSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  category_id: z.string().min(1),
  seller_id: z.string().optional().nullable(),
  description: z.string().optional(),
  price: z.number().positive().optional().nullable(),
  price_display_mode: z.enum(['exact', 'on_request', 'approximate']),
  availability: z.enum(['available', 'check_availability', 'out_of_stock']),
  location: z.string().optional().nullable(),
  show_seller: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
});

// POST /api/admin/products — create product
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const body = await request.json();
  const parsed = ProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  // Auto-generate code if not provided
  let code = data.code;
  if (!code) {
    // Get category prefix
    const { data: cat } = await admin.from('categories').select('code_prefix').eq('id', data.category_id).single();
    if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    // Get and increment sequence
    const { data: seq } = await admin
      .from('product_code_sequences')
      .select('next_number')
      .eq('code_prefix', cat.code_prefix)
      .single();

    const number = seq?.next_number || 1;
    code = generateProductCode(cat.code_prefix, number);

    await admin
      .from('product_code_sequences')
      .upsert({ code_prefix: cat.code_prefix, next_number: number + 1 });
  }

  const slug = codeToSlug(code);

  const { data: product, error } = await admin
    .from('products')
    .insert({
      ...data,
      code,
      slug,
      price: data.price ?? null,
      seller_id: data.seller_id ?? null,
      description: data.description ?? null,
      location: data.location ?? null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Product code already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(product, { status: 201 });
}
