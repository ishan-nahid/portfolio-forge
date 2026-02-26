import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Certifications = ({ certifications: certs, isLoading }: any) => {
  if (isLoading) {
    return (
      <section id="certifications" className="section-container">
        <Skeleton className="h-10 w-56 mb-4" />
        <Skeleton className="h-5 w-64 mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </section>
    );
  }

  if (!certs || certs.length === 0) return null;

  return (
    <section id="certifications" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title"><span className="gradient-text">Certifications</span></h2>
        <p className="section-subtitle">Professional credentials</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert: any, i: number) => (
          <motion.div
            key={cert.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-6"
          >
            <Award className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">{cert.name}</h3>
            <p className="text-sm text-primary mb-1">{cert.issuer}</p>
            {cert.date && <p className="text-xs text-muted-foreground font-mono mb-2">{cert.date}</p>}
            {cert.credential_id && <p className="text-xs text-muted-foreground">ID: {cert.credential_id}</p>}
            {cert.credential_url && (
              <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
                Verify <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;