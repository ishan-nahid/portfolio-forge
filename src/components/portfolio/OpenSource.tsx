import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  contributions: any[];
  isLoading: boolean;
}

const OpenSource = ({ contributions, isLoading }: Props) => {
  if (isLoading) {
    return (
      <section className="section-container">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-40 rounded-xl" />
      </section>
    );
  }

  if (!contributions || contributions.length === 0) return null;

  return (
    <section className="section-container">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
        <h2 className="section-title">
          Open <span className="gradient-text">Source</span>
        </h2>
        <p className="section-subtitle">Community contributions</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {contributions.map((c: any, i: number) => (
          <div key={i} className="glass-card-hover p-6">
            <h3 className="font-semibold text-lg">{c.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {c.contribution_type}
            </p>
            <p className="text-sm text-muted-foreground">{c.description}</p>
            {c.repo_url && (
              <a
                href={c.repo_url}
                target="_blank"
                className="text-primary text-sm mt-2 inline-block"
              >
                View Repository →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default OpenSource;
