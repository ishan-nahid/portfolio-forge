import { Github, Linkedin, Mail } from "lucide-react";

type ProfileData = {
  full_name: string;
  role: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
  email?: string;
};

type FooterProps = {
  profile: ProfileData | null;
};

export function Footer({ profile }: FooterProps) {
  const name = profile?.full_name || "";
  const email = profile?.email;
  const github = profile?.github_url || "";
  const linkedin = profile?.linkedin_url || "";

  const hasGithub = Boolean(github && github !== "#");
  const hasLinkedin = Boolean(linkedin && linkedin !== "#");

  return (
    <footer id="contact" className="border-t border-border py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Let's connect</h2>
        <p className="mb-8 text-muted-foreground">Have a project in mind or just want to chat? Drop me a line.</p>

        {email && (
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline underline-offset-4">
            <Mail className="h-5 w-5" /> {email}
          </a>
        )}

        <div className="mt-12 flex items-center justify-center gap-6">
          {hasGithub && (
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
          )}
          {hasLinkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">Built with React & Tailwind by {name}.</p>
      </div>
    </footer>
  );
}
