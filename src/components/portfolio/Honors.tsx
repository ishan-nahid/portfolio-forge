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
    <section id="honors" ref={ref} className="reveal px-4 py-24">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-center text-sm font-medium uppercase tracking-[0.3em] text-primary">Honors</h2>
        <p className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">Awards & recognition</p>

        <div className="relative space-y-8 pl-8 before:absolute before:bottom-1 before:left-3 before:top-1 before:w-px before:bg-border sm:pl-10 sm:before:left-4">
          {honors.map((honor) => (
            <article key={`${honor.award}-${honor.awarded_on}`} className="relative rounded-2xl border border-border bg-card/70 p-5 shadow-lg backdrop-blur">
              <div className="absolute -left-[1.7rem] top-5 rounded-full border border-primary/30 bg-primary/10 p-1.5 sm:-left-[2rem]">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{honor.awarded_on}</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{honor.award}</h3>
              <p className="text-sm text-muted-foreground">{honor.issuer}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{honor.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
