import { Code2, Database, Layout, Server, Cpu, Palette, GitBranch, Cloud } from 'lucide-react';

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'design';
  level: number; // 1-5
  icon: React.ComponentType<{ className?: string }>;
}

export const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'frontend', level: 5, icon: Layout },
  { name: 'Next.js', category: 'frontend', level: 5, icon: Code2 },
  { name: 'TypeScript', category: 'frontend', level: 5, icon: Code2 },
  { name: 'Tailwind CSS', category: 'frontend', level: 5, icon: Palette },

  // Backend
  { name: 'Node.js', category: 'backend', level: 4, icon: Server },
  { name: 'Python', category: 'backend', level: 4, icon: Cpu },

  // Database
  { name: 'PostgreSQL', category: 'database', level: 4, icon: Database },
  { name: 'Prisma', category: 'database', level: 4, icon: Database },

  // Tools
  { name: 'Git', category: 'tools', level: 5, icon: GitBranch },
  { name: 'Vercel', category: 'tools', level: 4, icon: Cloud },
];

export const skillCategories = [
  { id: 'frontend', name: 'Frontend', color: 'from-blue-500 to-cyan-500' },
  { id: 'backend', name: 'Backend', color: 'from-purple-500 to-pink-500' },
  { id: 'database', name: 'Database', color: 'from-green-500 to-emerald-500' },
  { id: 'tools', name: 'Tools', color: 'from-orange-500 to-red-500' },
  { id: 'design', name: 'Design', color: 'from-indigo-500 to-violet-500' },
];