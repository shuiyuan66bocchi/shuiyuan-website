import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Calendar, ArrowRight, Pencil } from 'lucide-react';
import FloatingAddButton from '@/components/layout/FloatingAddButton';
import MdUploadButton from '@/components/admin/MdUploadButton';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[var(--border-primary)]">
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">Blog</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Thoughts, tutorials, and insights on development
              </p>
            </div>
            <MdUploadButton />
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {posts.length > 0 ? (
          <div className="divide-y divide-[var(--border-secondary)] border-y border-[var(--border-primary)]">
            {posts.map((post) => (
              <article key={post.id} className="py-6">
                <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post.createdAt.toISOString()}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="mx-1">·</span>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="inline-flex items-center gap-1 text-[var(--text-tertiary)] hover:text-[var(--accent-blue)]"
                    title="Edit this post"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                </div>
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="mb-1 text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)]">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="mb-2 text-sm text-[var(--text-secondary)]">{post.excerpt}</p>
                )}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-blue)] hover:underline"
                >
                  Read more <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--text-tertiary)]">No blog posts yet.</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">Check back soon for new content!</p>
          </div>
        )}
      </div>

      <FloatingAddButton />
    </div>
  );
}
