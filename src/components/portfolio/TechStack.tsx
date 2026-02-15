import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function TechStack() {
  const ref = useScrollReveal<HTMLElement>();
  const { techStack } = PORTFOLIO_DATA;
  const allTech = Object.entries(techStack);

  // Flat list for marquee
  const flat = Object.values(techStack).flat();
  const doubled = [...flat, ...flat];

  return (
    <section id="skills" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Tech Stack</h2>
        <p className="mb-12 text-center text-3xl font-bold text-foreground sm:text-4xl">Tools I work with</p>

        {/* Marquee */}
        <div className="relative mb-16 overflow-hidden py-4">
          <div className="flex w-max gap-4 animate-marquee">
            {doubled.map((t, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Categorized grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {allTech.map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="rounded-md border border-border bg-card px-3 py-1 text-sm text-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
