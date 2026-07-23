import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4">
          <Link href="/admin" className="text-sm font-semibold text-[var(--text-primary)]">
            Dashboard
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/admin/projects" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Projects
            </Link>
            <Link href="/admin/posts" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Posts
            </Link>
            <Link href="/admin/contacts" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Messages
            </Link>
            <Link href="/" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]">
              View Site
            </Link>
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
