import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  problems: any[];
  isLoading: boolean;
}

const ProblemSolving = ({ problems, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section className="section-container">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-40 rounded-xl" />
      </section>
    );
  }

  if (!problems || problems.length === 0) return null;

  return (
    <section className="section-container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
        <h2 className="section-title">
          Problem <span className="gradient-text">Solving</span>
        </h2>
        <p className="section-subtitle">Competitive programming & algorithmic challenges</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {problems.map((p: any, i: number) => (
          <div key={i} className="glass-card-hover p-6">
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{p.platform}</p>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                className="text-primary text-sm mt-2 inline-block"
              >
                View Problem →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProblemSolving;
