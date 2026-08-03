'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Plus, FileText, FolderGit2 } from 'lucide-react';

export default function FloatingAddButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if the user is logged in via the auth status endpoint
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't render the FAB for unauthenticated users
  if (!authenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all ${
          isOpen
            ? 'rotate-45 bg-[var(--bg-secondary)] text-[var(--text-primary)]'
            : 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-hover)]'
        }`}
        aria-label="Create new"
      >
        <Plus className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 w-48 overflow-hidden rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-lg">
          <Link
            href="/admin/projects/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
          >
            <FolderGit2 className="h-4 w-4 text-[var(--accent-blue)]" />
            New Project
          </Link>
          <div className="border-t border-[var(--border-secondary)]" />
          <Link
            href="/admin/posts/new"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
          >
            <FileText className="h-4 w-4 text-[var(--accent-green)]" />
            New Blog Post
          </Link>
        </div>
      )}
    </div>
  );
}
