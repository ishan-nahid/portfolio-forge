import { Award, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export type CertificationData = {
  id?: string;
  title: string;
  issuer: string;
  date_earned: string;
  url: string;
};

type CertificationsProps = {
  certifications: CertificationData[];
};

export function Certifications({ certifications }: CertificationsProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <section id="certifications" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary text-center">Certifications</h2>
        <p className="mb-16 text-center text-3xl font-bold text-foreground sm:text-4xl">Credentials & badges</p>

        <div className="grid gap-4">
          {certifications.map((cert) => {
            const hasUrl = Boolean(cert.url && cert.url !== "#");

            return (
              <article
                key={`${cert.issuer}-${cert.title}-${cert.date_earned}`}
                className="group rounded-xl border border-border bg-card/80 p-5 transition-all hover:border-primary/40 hover:bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-foreground">{cert.title}</p>
                    <p className="text-sm text-primary">{cert.issuer}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Earned {cert.date_earned}</p>
                  </div>
                  <Award className="h-5 w-5 text-primary/80" />
                </div>
                {hasUrl && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    View credential <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
