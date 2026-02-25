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
    <section id="about" ref={ref} className="reveal py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">About</h2>
        <p className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Beyond shipping software</p>

        <div className="grid auto-rows-[minmax(150px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-[0_16px_50px_hsl(var(--background)/0.72)] backdrop-blur-xl sm:col-span-2 sm:row-span-2">
            <GraduationCap className="mb-4 h-6 w-6 text-primary" />
            <h3 className="mb-1 text-xl font-semibold text-foreground">{education.degree}</h3>
            <p className="mb-1 text-sm text-muted-foreground">{education.university}</p>
            <p className="mb-4 text-sm font-medium text-primary/90">Focus: {education.gpa}</p>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Key Coursework</p>
            <div className="flex flex-wrap gap-2">
              {education.coursework.map((course) => (
                <span key={course} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-foreground/90">
                  {course}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-[0_16px_50px_hsl(var(--background)/0.72)] backdrop-blur-xl sm:row-span-2">
            <Users className="mb-4 h-6 w-6 text-primary" />
            <h3 className="mb-3 text-lg font-semibold text-foreground">Community & Volunteering</h3>
            <ul className="space-y-3">
              {volunteering.map((item, index) => (
                <li key={index} className="text-sm leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-[0_16px_50px_hsl(var(--background)/0.72)] backdrop-blur-xl">
            <Heart className="mb-3 h-5 w-5 text-primary" />
            <h3 className="mb-2 text-base font-semibold text-foreground">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <span key={hobby} className="text-xs text-muted-foreground">
                  {hobby}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card/70 p-6 shadow-[0_16px_50px_hsl(var(--background)/0.72)] backdrop-blur-xl sm:col-span-2">
            <Award className="mb-4 h-6 w-6 text-primary" />
            <h3 className="mb-3 text-lg font-semibold text-foreground">Notable Highlights</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {awards.map((award, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/70" />
                  {award}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
