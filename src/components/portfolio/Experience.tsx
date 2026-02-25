import { useScrollReveal } from "@/hooks/useScrollReveal";

type ExperienceData = {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
};

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

type ExperienceProps = {
  experience: ExperienceData[];
};

export function Experience({ experience: dbExperience }: ExperienceProps) {
  const ref = useScrollReveal<HTMLElement>();

  const experience: ExperienceItem[] = dbExperience.map((e) => ({
    role: e.role || "Software Engineer",
    company: e.company || "Confidential",
    period: `${e.start_date || "Start"} — ${e.end_date || "Present"}`,
    bullets: e.description.split("\n").filter(Boolean),
  }));

  return (
    <section id="experience" ref={ref} className="reveal py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">Experience</h2>
        <p className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Engineering roles and outcomes</p>

        {experience.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-card/40 px-4 py-12 text-center text-muted-foreground">Experience details will be added shortly.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 lg:left-1/2 lg:-translate-x-px" />

            <div className="flex flex-col gap-12">
              {experience.map((exp, i) => (
                <TimelineEntry key={`${exp.company}-${i}`} entry={exp} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function TimelineEntry({ entry, index }: { entry: ExperienceItem; index: number }) {
  const ref = useScrollReveal<HTMLDivElement>();
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`reveal relative pl-12 lg:pl-0 lg:w-1/2 ${isLeft ? "lg:pr-12 lg:self-start" : "lg:pl-12 lg:self-end"}`}>
      <div className={`absolute top-2 left-3 h-3 w-3 rounded-full border-2 border-background bg-primary lg:left-auto ${isLeft ? "lg:-right-1.5" : "lg:-left-1.5"}`} />

      <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-[0_20px_60px_hsl(var(--background)/0.75)] backdrop-blur-xl">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/90">{entry.period}</p>
        <h3 className="text-lg font-semibold text-foreground">{entry.role}</h3>
        <p className="mb-3 text-sm text-muted-foreground">{entry.company}</p>
        <ul className="space-y-2">
          {entry.bullets.map((b, j) => (
            <li key={j} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/70" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
