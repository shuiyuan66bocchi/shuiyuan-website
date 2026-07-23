import { createPost } from '@/lib/actions';
import { PostForm } from '@/components/admin/PostForm';

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">New Blog Post</h1>
      <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] p-6">
        <PostForm action={createPost} />
      </div>
    </div>
  );
}
