import { Github, Linkedin, Mail } from "lucide-react";

const Footer = ({ profile }: any) => {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile?.full_name || "Ishan Ahmad"}. Built with precision.
        </p>
        <div className="flex items-center gap-4">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-4 w-4" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;