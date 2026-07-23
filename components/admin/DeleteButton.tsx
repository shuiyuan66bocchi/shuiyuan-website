'use client';

import { useFormStatus } from 'react-dom';

export function DeleteButton({ action, id, label }: { action: (formData: FormData) => void; id: string; label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-[var(--accent-red)] hover:underline disabled:opacity-50"
      onClick={(e) => {
        if (!confirm(`Delete this ${label}?`)) e.preventDefault();
      }}
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
