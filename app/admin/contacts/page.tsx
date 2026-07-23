import { prisma } from '@/lib/prisma';
import { markMessageAsRead, deleteMessage } from '@/lib/actions';
import { DeleteButton } from '@/components/admin/DeleteButton';
import { Mail, Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminContactsPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Messages</h1>
        <span className="text-xs text-[var(--text-tertiary)]">{messages.length} total</span>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-md border bg-[var(--bg-primary)] p-5 ${
              !msg.read ? 'border-l-2 border-l-[var(--accent-blue)] border-[var(--border-primary)]' : 'border-[var(--border-primary)]'
            }`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{msg.name}</h3>
                <p className="text-xs text-[var(--text-tertiary)]">{msg.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-tertiary)]">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
                {!msg.read && (
                  <form action={markMessageAsRead}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded border border-[var(--border-primary)] px-2 py-1 text-xs text-[var(--accent-blue)] hover:bg-[var(--bg-secondary)]"
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3" /> Read
                    </button>
                  </form>
                )}
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={msg.id} />
                  <DeleteButton action={deleteMessage} id={msg.id} label="message" />
                </form>
              </div>
            </div>

            <p className="mb-1 text-xs font-medium text-[var(--text-primary)]">{msg.subject}</p>
            <p className="whitespace-pre-wrap text-xs text-[var(--text-secondary)]">{msg.message}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] py-16 text-center">
            <Mail className="mx-auto mb-3 h-8 w-8 text-[var(--text-tertiary)]" />
            <p className="text-sm text-[var(--text-tertiary)]">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
