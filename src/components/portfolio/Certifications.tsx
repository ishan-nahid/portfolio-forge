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
    <section id="certifications" ref={ref} className="reveal px-4 py-28">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.34em] text-primary/90">Certifications</h2>
        <p className="mb-14 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Credentials and continuous learning</p>

        {certifications.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-card/40 px-4 py-12 text-center text-muted-foreground">Certification records are being curated.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {certifications.map((cert) => {
              const hasUrl = Boolean(cert.url && cert.url !== "#");

              return (
                <article
                  key={`${cert.issuer}-${cert.title}-${cert.date_earned}`}
                  className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-card/70 p-5 shadow-[0_16px_50px_hsl(var(--background)/0.72)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary/90">
                        {cert.date_earned || "Issued"}
                      </span>
                      <Award className="h-4 w-4 text-primary/80" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{cert.title || "Certification"}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{cert.issuer || "Issuer"}</p>
                  </div>

                  {hasUrl ? (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                      View credential <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="mt-5 text-xs text-muted-foreground">Verification available on request</span>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
