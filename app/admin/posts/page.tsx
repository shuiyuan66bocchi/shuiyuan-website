import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { deletePost } from '@/lib/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Blog Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1 rounded-md border border-[var(--accent-green)] bg-[var(--accent-green)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-green-hover)]"
        >
          <Plus className="h-3.5 w-3.5" /> New
        </Link>
      </div>

      <div className="overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              <th className="px-4 py-2.5 text-left font-medium text-[var(--text-secondary)]">Title</th>
              <th className="px-4 py-2.5 text-left font-medium text-[var(--text-secondary)]">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-[var(--text-secondary)]">Created</th>
              <th className="px-4 py-2.5 text-right font-medium text-[var(--text-secondary)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-secondary)]">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-[var(--bg-secondary)]">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{post.title}</td>
                <td className="px-4 py-3">
                  {post.published ? (
                    <span className="rounded-full border border-[var(--accent-green)] bg-[var(--accent-green-bg)] px-2 py-0.5 text-xs text-[var(--accent-green)]">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--text-tertiary)]">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="mr-3 text-[var(--accent-blue)] hover:underline"
                  >
                    Edit
                  </Link>
                  <form action={deletePost} className="inline">
                    <input type="hidden" name="id" value={post.id} />
                    <DeleteButton action={deletePost} id={post.id} label="post" />
                  </form>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[var(--text-tertiary)]">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
