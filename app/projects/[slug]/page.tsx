import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Globe, GitBranch } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/ui';

type Props = {
  params: Promise<{ slug: string }>;
};

function parseTechStack(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }
  return [];
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  const techStack = parseTechStack(project.techStack);

  return (
    <div>
      <PageHeader title={project.title} description={project.description || undefined}>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--accent-blue)] bg-[var(--accent-blue)] px-3 py-1.5 text-xs font-medium text-white hover:bg-[var(--accent-blue-hover)]"
            >
              <Globe className="h-3.5 w-3.5" /> Demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            >
              <GitBranch className="h-3.5 w-3.5" /> Code
            </a>
          )}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* Tech stack */}
        {techStack.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        {project.content ? (
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-[var(--text-tertiary)]">
            No detailed description yet.
          </p>
        )}
      </div>

      {/* Back link */}
      <div className="mx-auto max-w-3xl px-4 pb-12 md:px-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-[var(--accent-blue)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> All Projects
        </Link>
      </div>
    </div>
  );
}
