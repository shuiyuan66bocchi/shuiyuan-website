'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { PageHeader, Button } from '@/components/ui';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message');
      }

      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div>
        <PageHeader title="Contact" description="Get in touch" />
        <div className="mx-auto max-w-lg px-4 py-16 text-center md:px-6">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-[var(--accent-green)]" />
          <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">Message Sent!</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Thank you for reaching out. I'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm text-[var(--accent-blue)] hover:underline"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Contact" description="Have a question or want to work together? Send me a message." />

      <div className="mx-auto max-w-lg px-4 py-8 md:px-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent-blue)]"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-xs font-medium text-[var(--text-primary)]">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition-colors resize-none focus:border-[var(--accent-blue)]"
              placeholder="Your message..."
            />
          </div>

          {error && (
            <p className="text-xs text-[var(--accent-red)]">{error}</p>
          )}

          <div className="pt-2">
            <Button type="submit" disabled={sending} icon={Send} iconPosition="right">
              {sending ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
