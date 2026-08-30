import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const { data: categories, error } = await admin
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ categories });
}

const CategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  code_prefix: z.string().min(1).toUpperCase(),
  description: z.string().optional().nullable(),
  display_order: z.number().default(0),
  is_active: z.boolean().default(true),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const body = await request.json();
  const parsed = CategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 });
  }

  const { data: category, error } = await admin
    .from('categories')
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also initialize product_code_sequences
  await admin
    .from('product_code_sequences')
    .insert({ code_prefix: parsed.data.code_prefix, next_number: 1 })
    .select()
    .maybeSingle();

  return NextResponse.json(category, { status: 201 });
}
