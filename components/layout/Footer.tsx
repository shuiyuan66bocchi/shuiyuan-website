import Link from 'next/link';

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Settings', href: '/settings' },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--text-secondary)]">
              © {currentYear} shuiyuan
            </span>
          </div>
          <nav className="flex flex-wrap justify-center gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 border-t border-[var(--border-secondary)] pt-4 text-center">
          <p className="text-xs text-[var(--text-tertiary)]">
            Built with Next.js &middot; Hosted on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
