import { ArrowRight, Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { skills } from '@/data/skills';
import { PageHeader, Button } from '@/components/ui';

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Me"
        description="Full-stack developer passionate about modern web technologies"
      />

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* Bio */}
        <div className="mb-10">
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">Bio</h2>
          <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              I'm a full-stack developer with expertise in modern web technologies. I enjoy solving complex problems through technology and design, creating applications that are both functional and delightful to use.
            </p>
            <p>
              My approach combines technical excellence with user-centered design, ensuring that every project not only works well but also provides an exceptional user experience.
            </p>
            <p>
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-10">
          <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)]">Core Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
                >
                  {skill.name}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-[var(--text-primary)]">
            Experience & Education
          </h2>
          <div className="space-y-6">
            {/* Experience */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <Briefcase className="h-4 w-4 text-[var(--accent-blue)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Full-stack Developer
                </h3>
                <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <Calendar className="h-3 w-3" />
                  <span>2022 - Present</span>
                  <MapPin className="h-3 w-3" />
                  <span>Remote</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Building web applications for various clients, focusing on performance, scalability, and user experience.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <GraduationCap className="h-4 w-4 text-[var(--accent-blue)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  Computer Science Degree
                </h3>
                <div className="mb-1 flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <Calendar className="h-3 w-3" />
                  <span>2018 - 2022</span>
                  <MapPin className="h-3 w-3" />
                  <span>University</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Graduated with honors, focusing on software engineering and web technologies.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <h3 className="mb-1 text-base font-semibold text-[var(--text-primary)]">
            Let's Connect
          </h3>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Interested in working together or have a project in mind?
          </p>
          <Link href="/contact">
            <Button variant="secondary" size="sm">
              Get in touch <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
