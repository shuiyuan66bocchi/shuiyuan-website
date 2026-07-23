/** Simple frontmatter parser: returns { data, content } */
export function parseFrontmatter(text: string): {
  data: Record<string, string | boolean | string[]>;
  content: string;
} {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    // No frontmatter — try to extract title from first # heading
    const titleMatch = text.match(/^#\s+(.+)/m);
    return {
      data: { title: titleMatch?.[1] || text.split('\n')[0].slice(0, 80) },
      content: text,
    };
  }

  const raw = match[1];
  const content = match[2];
  const data: Record<string, string | boolean | string[]> = {};

  for (const line of raw.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)/);
    if (kv) {
      const val = kv[2].trim();
      if (val === 'true' || val === 'false') {
        data[kv[1]] = val === 'true';
      } else if (val.startsWith('[') && val.endsWith(']')) {
        data[kv[1]] = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
      } else {
        data[kv[1]] = val;
      }
    }
  }

  if (!data.title) {
    const titleMatch = content.match(/^#\s+(.+)/m);
    data.title = titleMatch?.[1] || 'Untitled';
  }

  return { data, content };
}

/** Slugify a string for URL-safe identifiers */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'untitled'
  );
}
