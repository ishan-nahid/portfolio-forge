import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  experience: any[];
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

const Experience = ({
  experience: experiences,
  isLoading,
  title = "Work Experience",
  subtitle = "Where I've contributed",
}: Props) => {
  if (isLoading) {
    return (
      <section className="section-container">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6">
            <Skeleton className="h-40 rounded-xl" />
          </div>
        ))}
      </section>
    );
  }

  if (!experiences || experiences.length === 0) return null;

  return (
    <section className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">
          {title.split(" ")[0]}{" "}
          <span className="gradient-text">
            {title.split(" ").slice(1).join(" ")}
          </span>
        </h2>
        <p className="section-subtitle">{subtitle}</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden md:block" />

        {experiences.map((exp: any, i: number) => (
          <motion.div
            key={exp.id || i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative md:pl-12 mb-8"
          >
            <div className="absolute left-3 top-6 w-3 h-3 rounded-full bg-primary border-2 border-background hidden md:block" />

            <div className="glass-card-hover p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <p className="text-primary text-sm">
                    {exp.company}
                  </p>
                </div>
                {exp.period && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {exp.period}
                  </span>
                )}
              </div>

              {exp.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
