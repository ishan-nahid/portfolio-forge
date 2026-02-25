import { useMemo, useRef, useState, useEffect } from "react";

export type SkillData = {
  id?: string;
  name: string;
  category: string;
};

type SkillsProps = {
  skills: SkillData[];
};

export function Skills({ skills }: SkillsProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const grouped = useMemo(
    () =>
      skills.reduce<Record<string, SkillData[]>>((acc, skill) => {
        const key = skill.category || "General";
        if (!acc[key]) acc[key] = [];
        acc[key].push(skill);
        return acc;
      }, {}),
    [skills],
  );

  return (
    <section id="skills" ref={sectionRef} className="px-4 py-28">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">Skills</h2>
        <p className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Systems, languages, and product craftsmanship</p>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-card/70 p-6 shadow-[0_20px_80px_hsl(var(--background)/0.8)] backdrop-blur-xl sm:p-8">
          {Object.entries(grouped).map(([category, items], categoryIndex) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">{category}</h3>
              <div className="flex flex-wrap gap-2.5">
                {items.map((skill, skillIndex) => {
                  const delay = (categoryIndex * 0.12) + (skillIndex * 0.04);

                  return (
                    <span
                      key={`${category}-${skill.name}`}
                      style={{ transitionDelay: `${delay}s` }}
                      className={`rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/95 transition-all duration-500 hover:scale-105 hover:border-primary/60 hover:bg-primary/15 ${
                        isInView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                      }`}
                    >
                      {skill.name}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
