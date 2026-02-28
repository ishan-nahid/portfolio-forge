import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Server, Database, Code2, LayoutTemplate } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "1. Backend Engineering": <Server className="h-5 w-5 text-blue-500" />,
  "2. Databases & Data Layer": <Database className="h-5 w-5 text-emerald-500" />,
  "3. Deployment & Infrastructure": <Code2 className="h-5 w-5 text-amber-500" />,
  "4. Frontend (Supporting)": <LayoutTemplate className="h-5 w-5 text-purple-500" />
};

const Skills = ({ skills, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="skills" className="section-container">
        <Skeleton className="h-10 w-40 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  // Group by category and sort them alphabetically (which respects our "1.", "2." numbering)
  const grouped: Record<string, typeof skills> = {};
  skills?.forEach((s: any) => {
    const cat = s.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(s);
  });

  const sortedCategories = Object.keys(grouped).sort();

  return (
    <section id="skills" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Technical <span className="gradient-text">Expertise</span></h2>
        <p className="section-subtitle">Production technologies and system architecture</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {sortedCategories.map((category, catIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}
            className="bg-card border border-border/50 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              {categoryIcons[category] || <CheckCircle2 className="h-5 w-5 text-primary" />}
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {category.replace(/^\d+\.\s/, '') /* Removes the "1. " prefix for display */}
              </h3>
            </div>
            
            <div className="space-y-5">
              {grouped[category]?.map((skill: any, i: number) => (
                <div key={skill.id || skill.name} className="flex items-start gap-3">
                  <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-primary/60" />
                  <div>
                    <span className="font-semibold text-foreground">{skill.name}</span>
                    {skill.context && (
                      <span className="text-muted-foreground text-sm leading-relaxed block mt-0.5">
                        {skill.context}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {(!skills || skills.length === 0) && (
        <p className="text-muted-foreground text-center py-8">Skills will appear here once added via the admin dashboard.</p>
      )}
    </section>
  );
};

export default Skills;
