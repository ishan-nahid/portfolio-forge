import { GraduationCap } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type EducationData = {
  id?: string;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  description: string;
};

type EducationProps = {
  education: EducationData[];
};

export function Education({ education }: EducationProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="education" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Education</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Academic background</p>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((item) => (
            <article key={`${item.institution}-${item.degree}-${item.start_date}`} className="rounded-xl border border-border bg-card/80 p-6 shadow-[0_0_0_1px_hsl(var(--border)/0.35)] backdrop-blur-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{item.degree}</h3>
                  <p className="text-sm text-primary">{item.institution}</p>
                </div>
                <GraduationCap className="h-5 w-5 text-primary/80" />
              </div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {item.start_date} — {item.end_date}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
