import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Education = ({ education, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="education" className="section-container">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        {[1, 2].map((i) => <Skeleton key={i} className="h-48 rounded-xl mb-6" />)}
      </section>
    );
  }

  return (
    <section id="education" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><span className="gradient-text">Education</span></h2>
        <p className="section-subtitle">Academic background</p>
      </motion.div>

      <div className="space-y-6">
        {education?.map((edu: any, i: number) => (
          <motion.div
            key={edu.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{edu.degree}</h3>
                  {edu.period && <span className="text-xs text-muted-foreground font-mono">{edu.period}</span>}
                </div>
                <p className="text-primary text-sm mb-2">{edu.institution}{edu.location ? ` · ${edu.location}` : ""}</p>

                {/* ADDED DESCRIPTION FIELD HERE */}
                {edu.description && <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap leading-relaxed">{edu.description}</p>}

                {edu.gpa && <p className="text-sm text-muted-foreground mb-1">GPA: {edu.gpa}</p>}
                {edu.focus && <p className="text-sm text-muted-foreground mb-1">Focus: {edu.focus}</p>}
                {edu.thesis && <p className="text-sm text-muted-foreground mb-2">Thesis: {edu.thesis}</p>}

                {edu.courses && edu.courses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {edu.courses.map((c: string) => (
                      <span key={c} className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">{c}</span>
                    ))}
                  </div>
                )}

                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {edu.achievements.map((a: string, j: number) => <li key={j}>{a}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {(!education || education.length === 0) && (
        <p className="text-muted-foreground text-center py-8">Education will appear here once added via the admin dashboard.</p>
      )}
    </section>
  );
};

export default Education;
