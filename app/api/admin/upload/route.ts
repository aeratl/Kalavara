import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productId = formData.get('product_id') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const admin = createAdminClient();
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `products/${timestamp}-${sanitizedFilename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to 'product-images' bucket
    const { data: uploadData, error: uploadError } = await admin.storage
      .from('product-images')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = admin.storage
      .from('product-images')
      .getPublicUrl(path);

    const publicUrl = publicUrlData.publicUrl;

    // If product_id is provided, associate with product_images table
    if (productId) {
      const { data: imgRecord, error: imgError } = await admin
        .from('product_images')
        .insert({
          product_id: productId,
          storage_path: path,
          public_url: publicUrl,
          is_primary: true,
          display_order: 0,
        })
        .select()
        .single();

      if (imgError) {
        console.error('Failed to link image record:', imgError);
      }

      return NextResponse.json({ path, publicUrl, image: imgRecord }, { status: 201 });
    }

    return NextResponse.json({ path, publicUrl }, { status: 201 });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
