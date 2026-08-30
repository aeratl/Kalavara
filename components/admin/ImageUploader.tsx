'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

export interface UploadedImage {
  id?: string;
  storage_path: string;
  public_url: string;
  is_primary?: boolean;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  productId?: string;
}

export default function ImageUploader({ images, onChange, productId }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | File[]) => {
    setError('');
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    const newImages: UploadedImage[] = [...images];

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are supported (JPG, PNG, WebP).');
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        if (productId) formData.append('product_id', productId);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        newImages.push({
          storage_path: data.path,
          public_url: data.publicUrl,
          is_primary: newImages.length === 0, // First uploaded image is primary
        });
      } catch (err: any) {
        console.error('File upload error:', err);
        setError(err.message || 'Failed to upload image.');
      }
    }

    onChange(newImages);
    setUploading(false);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [images]);

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // If we removed primary, set first remaining as primary
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true;
    }
    onChange(updated);
  };

  const setPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  return (
    <div>
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--foreground)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          background: dragActive ? 'var(--surface-hover)' : 'var(--surface)',
          transition: 'all 0.15s ease',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
          }}
          disabled={uploading}
        />

        <div style={{ pointerEvents: 'none' }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ margin: '0 auto 0.75rem', color: 'var(--foreground-secondary)' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)' }}>
            {uploading ? 'Uploading images…' : 'Drag & drop images here, or click to browse'}
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--foreground-tertiary)', marginTop: '0.25rem' }}>
            Supports JPG, PNG, WebP (multiple images allowed)
          </p>
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--red)', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}

      {/* Uploaded Previews */}
      {images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: '0.75rem',
            marginTop: '1rem',
          }}
        >
          {images.map((img, i) => (
            <div
              key={img.storage_path || i}
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                border: `2px solid ${img.is_primary ? 'var(--foreground)' : 'var(--border)'}`,
                background: 'var(--surface)',
              }}
            >
              <Image
                src={img.public_url}
                alt="Product preview"
                fill
                sizes="100px"
                style={{ objectFit: 'cover' }}
              />

              {/* Primary tag */}
              {img.is_primary && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    fontSize: '0.625rem',
                    textAlign: 'center',
                    padding: '2px 0',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  Cover
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
                title="Remove image"
              >
                ×
              </button>

              {/* Make primary button if not */}
              {!img.is_primary && (
                <button
                  type="button"
                  onClick={() => setPrimary(i)}
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#111',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '0.625rem',
                    padding: '2px 4px',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Set Cover
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
