'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft, Eye, Edit3, Save, Globe, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import FloatingAddButton from '@/components/layout/FloatingAddButton';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'split' | 'edit' | 'preview'>('split');

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: Post) => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setExcerpt(data.excerpt ?? '');
        setPublished(data.published);
      })
      .catch(() => router.push('/blog'))
      .finally(() => setLoading(false));
  }, [slug, router]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt, published }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [slug, title, content, excerpt, published]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[var(--text-tertiary)]">Loading...</p>
      </div>
    );
  }

  if (!post) return null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-2">
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <span className="text-[var(--border-primary)]">/</span>
          <span className="text-xs font-medium text-[var(--text-primary)]">{post.slug}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            published
              ? 'border border-[var(--accent-green)] bg-[var(--accent-green-bg)] text-[var(--accent-green)]'
              : 'border border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'
          }`}>
            {published ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggles */}
          <div className="mr-2 flex overflow-hidden rounded-md border border-[var(--border-primary)]">
            <button
              onClick={() => setView('edit')}
              className={`px-2.5 py-1.5 text-xs ${
                view === 'edit'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
              title="Edit only"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView('split')}
              className={`border-x border-[var(--border-primary)] px-2.5 py-1.5 text-xs ${
                view === 'split'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
              title="Split view"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView('preview')}
              className={`px-2.5 py-1.5 text-xs ${
                view === 'preview'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              }`}
              title="Preview only"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Save status */}
          {saved && (
            <span className="flex items-center gap-1 text-xs text-[var(--accent-green)]">
              <CheckCircle className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {error && (
            <span className="flex items-center gap-1 text-xs text-[var(--accent-red)]">
              <XCircle className="h-3.5 w-3.5" /> {error}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--accent-green)] bg-[var(--accent-green)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-green-hover)] disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Three-column editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Preview */}
        {(view === 'split' || view === 'preview') && (
          <div className={`flex flex-col overflow-hidden ${view === 'preview' ? 'w-full' : 'w-1/2 border-r border-[var(--border-primary)]'}`}>
            <div className="flex items-center justify-between border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-1.5">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">
                <Eye className="mr-1 inline h-3 w-3" />
                Preview
              </span>
              <span className="text-[10px] text-[var(--text-tertiary)]">
                {readTime} min read · {wordCount} words
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-3xl px-8 py-6">
                <h1 className="mb-4 text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
                  {title || 'Untitled'}
                </h1>
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*Start writing...*'}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Middle: Editor */}
        {(view === 'split' || view === 'edit') && (
          <div className={`flex flex-col overflow-hidden ${view === 'edit' ? 'w-full' : 'w-1/2'}`}>
            <div className="flex items-center border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-1.5">
              <Edit3 className="mr-1 h-3 w-3 text-[var(--text-tertiary)]" />
              <span className="text-xs font-medium text-[var(--text-tertiary)]">Editor</span>
            </div>
            <div className="flex flex-1 flex-col">
              {/* Title input */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-5 py-3 text-lg font-semibold text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
              />
              {/* Markdown textarea */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post in Markdown..."
                className="flex-1 resize-none bg-[var(--bg-primary)] px-5 py-4 font-mono text-sm leading-relaxed text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Right: Settings panel (always visible in split mode) */}
        {view === 'split' && (
          <div className="w-64 flex-shrink-0 border-l border-[var(--border-primary)] bg-[var(--bg-primary)]">
            <div className="border-b border-[var(--border-primary)] px-4 py-2">
              <h3 className="text-xs font-semibold text-[var(--text-primary)]">Post Settings</h3>
            </div>

            <div className="space-y-5 p-4">
              {/* Published toggle */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-[var(--border-primary)] text-[var(--accent-blue)]"
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">Published</span>
                </label>
                <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">
                  {published ? 'Visible on the blog' : 'Only you can see this'}
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-primary)]">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  placeholder="Short summary for the blog listing..."
                  className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-blue)]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--text-primary)]">Slug</label>
                <input
                  type="text"
                  value={post.slug}
                  disabled
                  className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-tertiary)] opacity-70"
                />
                <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">Slug cannot be changed</p>
              </div>

              {/* Metadata */}
              <div>
                <h4 className="mb-2 text-xs font-medium text-[var(--text-primary)]">Metadata</h4>
                <div className="space-y-1.5 text-[10px] text-[var(--text-tertiary)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    Updated: {new Date(post.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3 w-3" />
                    {wordCount} words
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--accent-green)] bg-[var(--accent-green)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-green-hover)] disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href={`/blog/${slug}`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  View Live
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <FloatingAddButton />
    </div>
  );
}
