'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { parseFrontmatter, slugify } from '@/lib/utils/markdown';

export default function MdUploadProjectButton() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'parsing' | 'uploading' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleFile(file: File) {
    if (!file.name.endsWith('.md')) {
      setMsg('Please select a .md file');
      setStatus('error');
      return;
    }

    setStatus('parsing');
    const text = await file.text();
    const { data, content } = parseFrontmatter(text);
    const title = String(data.title || file.name.replace(/\.md$/, ''));
    const slug = slugify(title);

    setStatus('uploading');
    try {
      const techStackRaw = data.techStack;
      const techStack = Array.isArray(techStackRaw)
        ? techStackRaw
        : typeof techStackRaw === 'string'
          ? techStackRaw.split(',').map((s: string) => s.trim())
          : [];

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description: String(data.description || ''),
          content,
          techStack,
          demoUrl: String(data.demoUrl || ''),
          repoUrl: String(data.repoUrl || ''),
          featured: data.featured === true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const project = await res.json();
      setStatus('done');
      setMsg('Created!');
      setTimeout(() => router.push(`/admin/projects/${project.id}/edit`), 500);
    } catch (e) {
      setStatus('error');
      setMsg(e instanceof Error ? e.message : 'Upload failed');
      setTimeout(() => { setStatus('idle'); setMsg(''); }, 3000);
    }
  }

  return (
    <div className="relative inline-flex">
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === 'parsing' || status === 'uploading'}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
      >
        {status === 'parsing' || status === 'uploading' ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : status === 'done' ? (
          <CheckCircle className="h-3.5 w-3.5 text-[var(--accent-green)]" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        {status === 'parsing' ? 'Parsing...' : status === 'uploading' ? 'Uploading...' : 'Upload .md'}
      </button>
      {msg && status === 'error' && (
        <span className="absolute -bottom-5 left-0 flex items-center gap-1 text-[10px] text-[var(--accent-red)] whitespace-nowrap">
          <XCircle className="h-3 w-3" /> {msg}
        </span>
      )}
    </div>
  );
}
