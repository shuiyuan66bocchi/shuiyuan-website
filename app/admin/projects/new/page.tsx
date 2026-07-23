import { createProject } from '@/lib/actions';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">New Project</h1>
      <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
