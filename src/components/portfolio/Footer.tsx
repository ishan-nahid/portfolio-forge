import { Github, Linkedin, Mail } from "lucide-react";
import { usePortfolioContent } from "@/hooks/usePortfolioContent";

export function Footer() {
  const { data } = usePortfolioContent();
  const { name, email, socials } = data;

  const hasGithub = Boolean(socials.github && socials.github !== "#");
  const hasLinkedin = Boolean(socials.linkedin && socials.linkedin !== "#");

  return (
    <footer id="contact" className="border-t border-border py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Let's connect</h2>
        <p className="mb-8 text-muted-foreground">Have a project in mind or just want to chat? Drop me a line.</p>

        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:underline underline-offset-4"
        >
          <Mail className="h-5 w-5" /> {email}
        </a>

        <div className="mt-12 flex items-center justify-center gap-6">
          {hasGithub ? (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          ) : null}

          {hasLinkedin ? (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          ) : null}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">Built with React & Tailwind by {name}.</p>
      </div>
    </footer>
  );
}
