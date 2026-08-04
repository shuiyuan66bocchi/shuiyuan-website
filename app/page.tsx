import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Calendar, Globe, Server, Database, Code } from 'lucide-react';
import FloatingAddButton from '@/components/layout/FloatingAddButton';

export const dynamic = 'force-dynamic';

const projectIcons = [Globe, Server, Database, Code] as const;

export default async function HomePage() {
  let projects: { id: string; title: string; slug: string; description: string | null; demoUrl: string | null; repoUrl: string | null }[] = [];
  let posts: { id: string; title: string; slug: string; excerpt: string | null; createdAt: Date }[] = [];
  let profile: { name: string; title: string | null; avatarUrl: string | null } | null = null;

  try {
    const data = await Promise.all([
      prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
      prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.profile.findUnique({ where: { id: 'default' } }),
    ]);
    projects = data[0];
    posts = data[1];
    profile = data[2];
  } catch (error) {
    console.error('Failed to load data:', error);
  }

  return (
    <div>
      {/* Minimal Hero */}
      <section className="border-b border-[var(--border-primary)]">
        <div className="mx-auto max-w-5xl px-4 py-20 md:px-6 md:py-28">
          <div className="flex items-center gap-6">
            <Link
              href="/profile"
              className="flex-shrink-0 transition-opacity hover:opacity-80"
              title="Edit profile"
            >
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] md:h-20 md:w-20">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[var(--accent-blue)] md:text-3xl">
                    {(profile?.name || 'S').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
                {profile?.name || 'shuiyuan'}
              </h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {profile?.title || 'Full-stack developer'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Projects */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Projects
              </h2>
              <Link
                href="/projects"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {projects.map((project, index) => {
                const Icon = projectIcons[index % projectIcons.length];
                return (
                  <Link
                    key={project.id}
                    href={project.demoUrl || project.repoUrl || `/projects/${project.slug}`}
                    className="flex items-center gap-3 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-3 transition-colors hover:border-[var(--text-tertiary)]"
                    target={project.demoUrl || project.repoUrl ? '_blank' : undefined}
                    rel={project.demoUrl || project.repoUrl ? 'noopener noreferrer' : undefined}
                  >
                    <div className="rounded-md bg-[var(--bg-secondary)] p-1.5">
                      <Icon className="h-4 w-4 text-[var(--accent-blue)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {project.title}
                      </p>
                      <p className="truncate text-xs text-[var(--text-tertiary)]">
                        {project.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
              {projects.length === 0 && (
                <p className="py-8 text-center text-sm text-[var(--text-tertiary)]">
                  No projects yet.
                </p>
              )}
            </div>
          </section>

          {/* Blog */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Blog
              </h2>
              <Link
                href="/blog"
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-3 transition-colors hover:border-[var(--text-tertiary)]"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {post.title}
                  </p>
                  {post.excerpt && (
                    <p className="mt-0.5 text-xs text-[var(--text-tertiary)] line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              ))}
              {posts.length === 0 && (
                <p className="py-8 text-center text-sm text-[var(--text-tertiary)]">
                  No posts yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <FloatingAddButton />
    </div>
  );
}
