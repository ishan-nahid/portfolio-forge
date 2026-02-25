import { useScrollReveal } from "@/hooks/useScrollReveal";

export type SkillData = {
  id?: string;
  name: string;
  category: string;
};

type SkillsProps = {
  skills: SkillData[];
};

export function Skills({ skills }: SkillsProps) {
  const ref = useScrollReveal<HTMLElement>();

  const grouped = skills.reduce<Record<string, SkillData[]>>((acc, skill) => {
    const key = skill.category || "General";
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="reveal px-4 py-24">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-center text-sm font-medium uppercase tracking-[0.3em] text-primary">Skills</h2>
        <p className="mb-14 text-center text-3xl font-bold text-foreground sm:text-4xl">Tools, stacks, and specialties</p>

        <div className="space-y-5 rounded-2xl border border-border bg-card/70 p-5 shadow-xl backdrop-blur sm:p-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">{category}</h3>
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill) => (
                  <span
                    key={`${category}-${skill.name}`}
                    className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:border-primary/60 hover:bg-primary/20"
                  >
                    {skill.name}
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
