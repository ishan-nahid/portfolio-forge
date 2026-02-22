import { useScrollReveal } from "@/hooks/useScrollReveal";

type SkillData = {
  name: string;
  category: string;
};

type TechStackProps = {
  skills: SkillData[];
};

export function TechStack({ skills }: TechStackProps) {
  const ref = useScrollReveal<HTMLElement>();

  const grouped: Record<string, string[]> = skills.reduce((acc, s) => {
    const cat = s.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {} as Record<string, string[]>);

  const allTech = Object.entries(grouped);
  const flat = Object.values(grouped).flat();
  const doubled = [...flat, ...flat];

  return (
    <section id="skills" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Skills</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Tech I use</p>

        <div className="grid gap-8 lg:grid-cols-2">
          {allTech.map(([category, items]) => (
            <div key={category} className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold text-foreground">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <span key={t} className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex gap-6 py-4 animate-[marquee_25s_linear_infinite] will-change-transform">
            {doubled.map((t, i) => (
              <span key={`${t}-${i}`} className="text-sm text-muted-foreground whitespace-nowrap">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
