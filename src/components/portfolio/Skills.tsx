import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const proficiencyColor: Record<string, string> = {
  expert: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  advanced: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  intermediate: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  beginner: "bg-muted text-muted-foreground border-border",
};

const Skills = ({ skills, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="skills" className="section-container">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </section>
    );
  }

  // Group by category
  const grouped: Record<string, typeof skills> = {};
  skills?.forEach((s: any) => {
    const cat = s.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(s);
  });

  return (
    <section id="skills" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Technical <span className="gradient-text">Skills</span></h2>
        <p className="section-subtitle">Technologies & tools I work with</p>
      </motion.div>

      {Object.entries(grouped).map(([category, items], catIdx) => (
        <div key={category} className="mb-8">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}
            className="text-sm font-mono text-primary uppercase tracking-widest mb-4"
          >
            {category}
          </motion.h3>
          <div className="flex flex-wrap gap-2">
            {items?.map((skill: any, i: number) => (
              <motion.div
                key={skill.id || skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.1 + i * 0.05 }}
                whileHover={{ scale: 1.08 }}
              >
                <Badge
                  variant="outline"
                  className={`px-3 py-1.5 text-sm cursor-default transition-all duration-200 ${
                    proficiencyColor[skill.proficiency ?? "intermediate"] ?? proficiencyColor.intermediate
                  }`}
                >
                  {skill.name}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {(!skills || skills.length === 0) && (
        <p className="text-muted-foreground text-center py-8">Skills will appear here once added via the admin dashboard.</p>
      )}
    </section>
  );
};

export default Skills;