import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const NoteSchema = z.object({
  note: z.string().min(1),
});

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const body = await request.json();
  const parsed = NoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Note content required' }, { status: 400 });
  }

  const { data: note, error } = await admin
    .from('admin_notes')
    .insert({
      order_request_id: id,
      note: parsed.data.note,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(note, { status: 201 });
}
