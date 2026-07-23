import { prisma } from '@/lib/prisma';
import { ExternalLink } from 'lucide-react';
import MdUploadProjectButton from '@/components/admin/MdUploadProjectButton';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Header */}
      <div className="border-b border-[var(--border-primary)]">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">Projects</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                A collection of my recent work and contributions
              </p>
            </div>
            <MdUploadProjectButton />
          </div>
        </div>
      </div>

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
                <div
                  key={project.id}
                  className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-5 transition-colors hover:border-[var(--text-tertiary)]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--bg-secondary)] text-sm font-bold text-[var(--accent-blue)]">
                      {project.title.charAt(0)}
                    </div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                      {project.title}
                    </h3>
                  </div>
                  <p className="mb-4 text-sm text-[var(--text-secondary)]">
                    {project.description || 'No description available.'}
                  </p>
                  {techStack.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
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
                  {(project.demoUrl || project.repoUrl) && (
                    <div className="flex items-center gap-4 border-t border-[var(--border-secondary)] pt-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--accent-blue)] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" /> Demo
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          <ExternalLink className="h-3 w-3" /> Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
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
