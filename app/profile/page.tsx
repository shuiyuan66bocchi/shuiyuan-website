'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Save, Camera, X, Check } from 'lucide-react';
import { PageHeader, Button } from '@/components/ui';

interface Profile {
  id: string;
  name: string;
  title: string;
  avatarUrl: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Crop state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedPixelsRef = useRef<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setName(data.name);
        setTitle(data.title);
      })
      .catch(() => router.push('/'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, title }),
      });
      router.push('/');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // File selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      croppedPixelsRef.current = null;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Store cropped area in ref (always fresh, no closure issues)
  function onCropComplete(_croppedArea: Area, croppedPixels: Area) {
    croppedPixelsRef.current = croppedPixels;
  }

  // Create cropped image and upload
  async function handleCropAndUpload() {
    const currentSrc = imageSrc;
    const currentPixels = croppedPixelsRef.current;

    if (!currentSrc || !currentPixels) {
      console.log('Missing data', { imageSrc: !!currentSrc, croppedPixels: !!currentPixels });
      return;
    }

    const img = new window.Image();
    img.src = currentSrc;
    await new Promise((resolve) => { img.onload = resolve; });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = currentPixels.width;
    canvas.height = currentPixels.height;

    ctx.drawImage(
      img,
      currentPixels.x,
      currentPixels.y,
      currentPixels.width,
      currentPixels.height,
      0,
      0,
      currentPixels.width,
      currentPixels.height,
    );

    const base64 = canvas.toDataURL('image/jpeg', 0.9);

    try {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => prev ? { ...prev, avatarUrl: data.avatarUrl } : prev);
        setImageSrc(null);
      } else {
        const err = await res.json();
        console.error('Upload failed', err);
        alert(err.detail || err.error || 'Upload failed');
      }
    } catch (e) {
      console.error('Upload error', e);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[var(--text-tertiary)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Profile" description="Edit your personal information" />

      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
        {/* Avatar Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Avatar</h2>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[var(--accent-blue)]">
                    {(profile?.name || 'S').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm transition-colors hover:bg-[var(--bg-secondary)]"
                title="Change avatar"
              >
                <Camera className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="text-xs text-[var(--text-tertiary)]">
              <p>Click the camera icon to upload</p>
              <p className="mt-0.5">Supports JPG, PNG · Square crop</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Name & Title */}
        <div className="mb-8 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-[var(--text-primary)]">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]"
            />
          </div>
          <div>
            <label htmlFor="title" className="mb-1 block text-xs font-medium text-[var(--text-primary)]">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} icon={Save}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Crop Modal */}
      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-[var(--bg-primary)] p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Crop Avatar</h3>
              <button onClick={() => setImageSrc(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Crop area */}
            <div className="relative h-80 w-full overflow-hidden rounded-lg bg-[#333]">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom slider */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-[var(--text-tertiary)]">Zoom:</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[var(--accent-blue)]"
              />
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setImageSrc(null)}>
                Cancel
              </Button>
              <Button variant="secondary" size="sm" onClick={handleCropAndUpload} icon={Check}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
