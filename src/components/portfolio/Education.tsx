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
    <section id="education" ref={ref} className="reveal py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">Education</h2>
        <p className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Academic foundation</p>

        {education.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-card/40 px-4 py-12 text-center text-muted-foreground">Education history will be published soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {education.map((item) => (
              <article key={`${item.institution}-${item.degree}-${item.start_date}`} className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-[0_18px_58px_hsl(var(--background)/0.75)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{item.degree || "Degree Program"}</h3>
                    <p className="text-sm text-primary/90">{item.institution || "Institution"}</p>
                  </div>
                  <GraduationCap className="h-5 w-5 text-primary/80" />
                </div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.start_date || "Start"} — {item.end_date || "End"}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
