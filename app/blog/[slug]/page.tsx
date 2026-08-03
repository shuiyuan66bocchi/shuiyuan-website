import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const wordCount = post.content.trim() ? post.content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <article>
        <header className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} min read &middot; {wordCount} words
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </article>

      {/* Footer */}
      <footer className="mt-12 border-t border-[var(--border-primary)] pt-6">
        <Link
          href="/blog"
          className="text-sm text-[var(--accent-blue)] hover:underline"
        >
          &larr; More posts
        </Link>
      </footer>
    </div>
  );
}
