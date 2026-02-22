import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useExperience } from "@/hooks/useSupabaseData";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";
import type { ExperienceItem } from "@/lib/portfolioContent";

export function Experience() {
  const ref = useScrollReveal<HTMLElement>();
  const { data: dbExperience, loading } = useExperience();
  const { data: fallback } = usePortfolioContent();

  // Use Supabase data if available, else fallback
  const experience: ExperienceItem[] = dbExperience.length > 0
    ? dbExperience.map((e) => ({
        role: e.role,
        company: e.company,
        period: `${e.start_date} — ${e.end_date}`,
        bullets: e.description ? e.description.split("\n").filter(Boolean) : [],
      }))
    : fallback.experience;

  return (
    <section id="experience" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Experience</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Where I've worked</p>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border lg:left-1/2 lg:-translate-x-px" />

          <div className="flex flex-col gap-12">
            {experience.map((exp, i) => (
              <TimelineEntry key={`${exp.company}-${i}`} entry={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({ entry, index }: { entry: ExperienceItem; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>();
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`reveal relative pl-12 lg:pl-0 lg:w-1/2 ${isLeft ? "lg:pr-12 lg:self-start" : "lg:pl-12 lg:self-end"}`}>
      <div className={`absolute top-1 left-3 h-3 w-3 rounded-full bg-primary border-2 border-background lg:left-auto ${isLeft ? "lg:-right-1.5" : "lg:-left-1.5"}`} />

      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-primary mb-1">{entry.period}</p>
        <h3 className="text-lg font-bold text-foreground">{entry.role}</h3>
        <p className="text-sm text-muted-foreground mb-3">{entry.company}</p>
        <ul className="space-y-2">
          {entry.bullets.map((b, j) => (
            <li key={j} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
