import { useState } from "react";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Updated links to include the root slash '/' so they work from the /blogs pages too!
const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "Certifications", href: "/#certifications" },
  { label: "Honors", href: "/#honors" },
  { label: "Contact", href: "/#contact" },
  { label: "Blogs", href: "/blogs" }, // NEW BLOG LINK
];

const Header = ({ profile }: any) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Brand Logo - Changed to Link so it routes to Home */}
        <Link to="/" className="font-mono font-semibold text-primary text-lg hover:opacity-80 transition-opacity">
          &lt;IA /&gt;
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-3 py-2 text-sm transition-colors rounded-md hover:bg-muted/50 ${
                l.href === "/blogs" 
                  ? "text-primary font-medium" // Highlight the blog link slightly
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon"><Github className="h-4 w-4" /></Button>
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon"><Linkedin className="h-4 w-4" /></Button>
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`}>
              <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/50 px-4 pb-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-sm transition-colors ${
                l.href === "/blogs"
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
