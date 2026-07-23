'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';

interface PostFormProps {
  action: (formData: FormData) => void;
  initialData?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    published: boolean;
  };
}

const inputClass =
  'w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--accent-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-opacity-30';
const labelClass = 'mb-1 block text-xs font-medium text-[var(--text-primary)]';

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--accent-green)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-green-hover)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
    </button>
  );
}

export function PostForm({ action, initialData }: PostFormProps) {
  return (
    <form action={action} className="space-y-4">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input type="text" id="title" name="title" required defaultValue={initialData?.title ?? ''} className={inputClass} placeholder="My Blog Post Title" />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>Slug</label>
        <input type="text" id="slug" name="slug" required defaultValue={initialData?.slug ?? ''} className={inputClass} placeholder="my-blog-post-title" />
        <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">URL-friendly identifier</p>
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={initialData?.excerpt ?? ''} className={inputClass} placeholder="A short summary shown on the blog listing" />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>Content (Markdown)</label>
        <textarea id="content" name="content" rows={16} required defaultValue={initialData?.content ?? ''} className={`${inputClass} font-mono text-xs`} placeholder="Write your blog post in Markdown..." />
        <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">Supports Markdown formatting</p>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" name="published" defaultChecked={initialData?.published ?? false} className="h-4 w-4 rounded border-[var(--border-primary)] text-[var(--accent-blue)]" />
        <label htmlFor="published" className="text-xs text-[var(--text-primary)]">Published (visible on the blog)</label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton isEdit={!!initialData} />
        <Link href="/admin/posts" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</Link>
      </div>
    </form>
  );
}
