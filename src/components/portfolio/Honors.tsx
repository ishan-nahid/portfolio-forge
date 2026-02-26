import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Honors = ({ honors, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="honors" className="section-container">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl mb-4" />)}
      </section>
    );
  }

  if (!honors || honors.length === 0) return null;

  return (
    <section id="honors" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Honors & <span className="gradient-text">Awards</span></h2>
        <p className="section-subtitle">Recognition & achievements</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

        {honors.map((honor: any, i: number) => (
          <motion.div
            key={honor.id || i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-12 mb-6"
          >
            <div className="absolute left-2 top-4 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <Star className="h-2.5 w-2.5 text-primary" />
            </div>

            <div className="glass-card-hover p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-1">
                <h3 className="font-semibold">{honor.title}</h3>
                {honor.date && <span className="text-xs text-muted-foreground font-mono">{honor.date}</span>}
              </div>
              <p className="text-sm text-primary mb-1">{honor.organization}</p>
              {honor.description && <p className="text-sm text-muted-foreground">{honor.description}</p>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Honors;