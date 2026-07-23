import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { FolderGit2, FileText, MessageSquare, Plus, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projectCount, featuredCount, postCount, publishedCount, unreadCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { featured: true } }),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">Dashboard</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <div className="mb-1 flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-[var(--accent-blue)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Projects</span>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{projectCount}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{featuredCount} featured</p>
        </div>

        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <div className="mb-1 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--accent-blue)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Posts</span>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{postCount}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{publishedCount} published</p>
        </div>

        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <div className="mb-1 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[var(--accent-blue)]" />
            <span className="text-xs font-medium text-[var(--text-secondary)]">Messages</span>
          </div>
          <p className="text-xl font-semibold text-[var(--text-primary)]">{unreadCount}</p>
          <p className="text-xs text-[var(--text-tertiary)]">unread</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-2 rounded-md border border-[var(--accent-green)] bg-[var(--accent-green)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-green-hover)]"
            >
              <Plus className="h-3.5 w-3.5" /> New Project
            </Link>
            <Link
              href="/admin/posts/new"
              className="flex items-center gap-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
            >
              <Plus className="h-3.5 w-3.5" /> New Blog Post
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Public Pages</h2>
          <div className="space-y-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: 'Blog', href: '/blog' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((page) => (
              <a
                key={page.href}
                href={page.href}
                target="_blank"
                className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ExternalLink className="h-3 w-3" />
                {page.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
