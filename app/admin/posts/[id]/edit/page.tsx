import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { updatePost } from '@/lib/actions';
import { PostForm } from '@/components/admin/PostForm';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">Edit Post</h1>
      <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
        <PostForm action={updatePost} initialData={post} />
      </div>
    </div>
  );
}
