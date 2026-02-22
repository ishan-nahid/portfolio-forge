import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Award, GraduationCap, Heart, Users } from "lucide-react";

type AboutData = {
  education: {
    degree: string;
    university: string;
    gpa: string;
    coursework: string[];
  };
  volunteering: string[];
  awards: string[];
  hobbies: string[];
};

type BentoGridProps = {
  about: AboutData;
};

export function BentoGrid({ about }: BentoGridProps) {
  const ref = useScrollReveal<HTMLElement>();
  const { education, volunteering, awards, hobbies } = about;

  return (
    <section id="about" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">About</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Beyond the code</p>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(140px,auto)]">
          <div className="rounded-lg border border-border bg-card p-6 sm:col-span-2 sm:row-span-2 flex flex-col justify-between">
            <div>
              <GraduationCap className="h-6 w-6 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-1">{education.degree}</h3>
              <p className="text-sm text-muted-foreground mb-1">{education.university}</p>
              <p className="text-sm font-medium text-primary mb-4">GPA: {education.gpa}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Key Coursework</p>
              <div className="flex flex-wrap gap-2">
                {education.coursework.map((c) => (
                  <span key={c} className="rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 sm:row-span-2 flex flex-col">
            <Users className="h-6 w-6 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-3">Volunteering</h3>
            <ul className="space-y-3 flex-1">
              {volunteering.map((v, i) => (
                <li key={i} className="text-sm text-muted-foreground leading-relaxed">
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
            <Heart className="h-5 w-5 text-primary mb-3" />
            <h3 className="text-base font-bold text-foreground mb-2">Life</h3>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((h) => (
                <span key={h} className="text-xs text-muted-foreground">{h}</span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 sm:col-span-2">
            <Award className="h-6 w-6 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-3">Awards & Certifications</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {awards.map((a, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
