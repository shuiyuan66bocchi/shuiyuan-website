import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ExternalLink } from 'lucide-react';
import MdUploadProjectButton from '@/components/admin/MdUploadProjectButton';
import { PageHeader } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="A collection of my recent work and contributions"
      >
        <div className="mt-4"><MdUploadProjectButton /></div>
      </PageHeader>

      {/* Project List */}
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        {projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const techStack =
                typeof project.techStack === 'string'
                  ? JSON.parse(project.techStack)
                  : Array.isArray(project.techStack)
                    ? project.techStack
                    : [];

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5 transition-colors hover:border-[var(--text-tertiary)]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--bg-secondary)] text-sm font-bold text-[var(--accent-blue)]">
                      {project.title.charAt(0)}
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)]">
                      {project.title}
                    </h3>
                  </div>
                  <p className="mb-4 text-sm text-[var(--text-secondary)]">
                    {project.description || 'No description available.'}
                  </p>
                  {techStack.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {techStack.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-2 py-0.5 text-xs text-[var(--text-secondary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs font-medium text-[var(--accent-blue)] opacity-0 group-hover:opacity-100">
                    View details <ExternalLink className="h-3 w-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-sm text-[var(--text-tertiary)]">No projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
