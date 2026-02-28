import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  education: any[];
  isLoading: boolean;
}

const Education = ({ education, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section id="education" className="section-container">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </section>
    );
  }

  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">
          My <span className="gradient-text">Education</span>
        </h2>
        <p className="section-subtitle">Academic background and qualifications</p>
      </motion.div>

      <div className="space-y-6 max-w-4xl">
        {education.map((item: any, i: number) => (
          <motion.div
            key={item.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start"
          >
            <div className="bg-primary/10 p-4 rounded-full text-primary shrink-0 hidden md:block">
              <GraduationCap size={32} />
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <h3 className="text-xl font-bold text-foreground">{item.degree}</h3>
                {item.period && (
                  <span className="text-sm font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full whitespace-nowrap">
                    {item.period}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <p className="text-lg font-medium text-primary">{item.institution}</p>
                {item.grade && (
                  <div className="flex items-center gap-1.5 text-sm font-bold bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1 rounded-md w-fit">
                    <Award size={16} /> CGPA: {item.grade}
                  </div>
                )}
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Education;
