'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { PageHeader } from '@/components/ui';

type Theme = 'light' | 'dark' | 'system';

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'system';
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) return stored;
    return 'system';
  });

  useEffect(() => {
    // Ensure class matches stored preference on mount
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  const options: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Customize your experience"
      />

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* Appearance */}
        <div className="mb-8">
          <h2 className="mb-1 text-base font-semibold text-[var(--text-primary)]">Appearance</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Choose your preferred theme for the site.
          </p>

          <div className="flex gap-3">
            {options.map((opt) => {
              const Icon = opt.icon;
              const selected = theme === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value);
                    if (opt.value === 'system') {
                      localStorage.removeItem('theme');
                      document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
                    } else {
                      localStorage.setItem('theme', opt.value);
                      document.documentElement.classList.toggle('dark', opt.value === 'dark');
                    }
                  }}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-md border p-5 transition-all ${
                    selected
                      ? 'border-[var(--accent-blue)] bg-[var(--accent-blue-bg)]'
                      : 'border-[var(--border-primary)] bg-[var(--bg-primary)] hover:border-[var(--text-tertiary)]'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      selected ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)]'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      selected ? 'text-[var(--accent-blue)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="mt-6 overflow-hidden rounded-md border border-[var(--border-primary)]">
            <div className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2">
              <span className="text-xs font-medium text-[var(--text-tertiary)]">Preview</span>
            </div>
            <div className="space-y-3 bg-[var(--bg-primary)] p-4">
              <div className="h-3 w-3/4 rounded bg-[var(--bg-tertiary)]" />
              <div className="h-3 w-1/2 rounded bg-[var(--bg-tertiary)]" />
              <div className="flex gap-2">
                <span className="rounded-md bg-[var(--accent-blue)] px-2 py-1 text-xs text-white">Button</span>
                <span className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-2 py-1 text-xs text-[var(--text-primary)]">Outline</span>
              </div>
              <div className="flex gap-1.5">
                <span className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2 py-0.5 text-[10px] text-[var(--text-secondary)]">tag</span>
                <span className="rounded-full border border-[var(--accent-green)] bg-[var(--accent-green-bg)] px-2 py-0.5 text-[10px] text-[var(--accent-green)]">published</span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-5">
          <h2 className="mb-1 text-base font-semibold text-[var(--text-primary)]">About</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Built with Next.js 16 · Prisma 7 · Tailwind CSS v4 · TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}
