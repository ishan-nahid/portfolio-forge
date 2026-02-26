import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Experience = ({ experience: experiences, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="experience" className="section-container">
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

  return (
    <section id="experience" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Work <span className="gradient-text">Experience</span></h2>
        <p className="section-subtitle">Where I've contributed</p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden md:block" />

        {experiences?.map((exp: any, i: number) => (
          <motion.div
            key={exp.id || i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative md:pl-12 mb-8"
          >
            {/* Timeline dot */}
            <div className="absolute left-3 top-6 w-3 h-3 rounded-full bg-primary border-2 border-background hidden md:block" />

            <div className="glass-card-hover p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{exp.title}</h3>
                  <p className="text-primary text-sm">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {exp.type && (
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary capitalize">
                      {exp.type}
                    </Badge>
                  )}
                  {exp.period && <span className="text-xs text-muted-foreground font-mono">{exp.period}</span>}
                </div>
              </div>

              {exp.description && (
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{exp.description}</p>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="text-sm text-muted-foreground space-y-1 mb-3 list-disc list-inside">
                  {exp.achievements.map((a: string, j: number) => (
                    <li key={j}>{a}</li>
                  ))}
                </ul>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((t: string) => (
                    <span key={t} className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {(!experiences || experiences.length === 0) && (
        <p className="text-muted-foreground text-center py-8">Experience will appear here once added via the admin dashboard.</p>
      )}
    </section>
  );
};

export default Experience;