import { Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type HonorData = {
  id?: string;
  award: string;
  issuer: string;
  description: string;
  awarded_on: string;
};

type HonorsProps = {
  honors: HonorData[];
};

export function Honors({ honors }: HonorsProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="honors" ref={ref} className="reveal px-4 py-28">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">Honors</h2>
        <p className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Recognition and milestones</p>

        {honors.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-card/40 px-4 py-12 text-center text-muted-foreground">Honors and awards will appear here.</p>
        ) : (
          <div className="relative space-y-8 pl-8 before:absolute before:bottom-1 before:left-3 before:top-1 before:w-px before:bg-white/10 sm:pl-10 sm:before:left-4">
            {honors.map((honor) => (
              <article key={`${honor.award}-${honor.awarded_on}`} className="relative rounded-2xl border border-white/10 bg-card/70 p-5 shadow-[0_16px_50px_hsl(var(--background)/0.72)] backdrop-blur-xl">
                <div className="absolute -left-[1.7rem] top-5 rounded-full border border-primary/30 bg-primary/10 p-1.5 sm:-left-[2rem]">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/90">{honor.awarded_on || "Awarded"}</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{honor.award || "Recognition"}</h3>
                <p className="text-sm text-muted-foreground">{honor.issuer || "Issuer"}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/85">{honor.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
