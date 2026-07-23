'use client';

import { useFormStatus } from 'react-dom';
import Link from 'next/link';

interface ProjectFormProps {
  action: (formData: FormData) => void;
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    techStack: unknown;
    demoUrl: string | null;
    repoUrl: string | null;
    featured: boolean;
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
      {pending ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
    </button>
  );
}

export function ProjectForm({ action, initialData }: ProjectFormProps) {
  const techStackValue = initialData?.techStack
    ? (() => {
        const parsed =
          typeof initialData.techStack === 'string'
            ? JSON.parse(initialData.techStack)
            : initialData.techStack;
        return Array.isArray(parsed) ? parsed.join(', ') : '';
      })()
    : '';

  return (
    <form action={action} className="space-y-4">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      <div>
        <label htmlFor="title" className={labelClass}>Title</label>
        <input type="text" id="title" name="title" required defaultValue={initialData?.title ?? ''} className={inputClass} placeholder="My Awesome Project" />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>Slug</label>
        <input type="text" id="slug" name="slug" required defaultValue={initialData?.slug ?? ''} className={inputClass} placeholder="my-awesome-project" />
        <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">URL-friendly identifier</p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <textarea id="description" name="description" rows={3} defaultValue={initialData?.description ?? ''} className={inputClass} placeholder="A short description of the project" />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>Content (Markdown)</label>
        <textarea id="content" name="content" rows={8} defaultValue={initialData?.content ?? ''} className={inputClass} placeholder="Full project details in Markdown..." />
      </div>

      <div>
        <label htmlFor="techStack" className={labelClass}>Tech Stack</label>
        <input type="text" id="techStack" name="techStack" defaultValue={techStackValue} className={inputClass} placeholder="React, Next.js, TypeScript" />
        <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">Comma-separated</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="demoUrl" className={labelClass}>Demo URL</label>
          <input type="url" id="demoUrl" name="demoUrl" defaultValue={initialData?.demoUrl ?? ''} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="repoUrl" className={labelClass}>Repository URL</label>
          <input type="url" id="repoUrl" name="repoUrl" defaultValue={initialData?.repoUrl ?? ''} className={inputClass} placeholder="https://github.com/..." />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" name="featured" defaultChecked={initialData?.featured ?? false} className="h-4 w-4 rounded border-[var(--border-primary)] text-[var(--accent-blue)]" />
        <label htmlFor="featured" className="text-xs text-[var(--text-primary)]">Featured project (shown on home page)</label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton isEdit={!!initialData} />
        <Link href="/admin/projects" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</Link>
      </div>
    </form>
  );
}
