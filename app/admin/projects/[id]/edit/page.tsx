import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { updateProject } from '@/lib/actions';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">Edit Project</h1>
      <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
        <ProjectForm action={updateProject} initialData={project} />
      </div>
    </div>
  );
}
