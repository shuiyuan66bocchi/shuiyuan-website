import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b border-[var(--border-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
