import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: settings, error } = await admin
    .from('site_settings')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settingsMap: Record<string, string | null> = {};
  (settings || []).forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return NextResponse.json({ settings: settingsMap });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createAdminClient();
  const body = await request.json();

  const updates = Object.entries(body).map(([key, value]) =>
    admin.from('site_settings').upsert({ key, value: String(value) })
  );

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}
