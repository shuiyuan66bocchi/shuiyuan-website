import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check — runs on every /admin page request
  const adminToken = process.env.ADMIN_TOKEN;

  if (adminToken) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || token !== adminToken) {
      redirect('/');
    }
  }

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
