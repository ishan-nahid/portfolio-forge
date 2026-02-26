import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Added this to prevent the toast from crashing!

const Contact = ({ profile }: any) => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    // Simulate send — in production connect to an edge function
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
    (e.target as HTMLFormElement).reset();
    setSending(false);
  };

  const contactInfo = [
    { icon: Mail, label: profile?.email || "contact@example.com", href: `mailto:${profile?.email || ""}` },
    ...(profile?.phone ? [{ icon: Phone, label: profile.phone, href: `tel:${profile.phone}` }] : []),
    ...(profile?.location ? [{ icon: MapPin, label: profile.location, href: "#" }] : []),
  ];

  return (
    <section id="contact" className="section-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
        <p className="section-subtitle">Let's build something great together</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <p className="text-muted-foreground leading-relaxed">
            I'm always open to discussing new projects, opportunities, or just having a conversation about technology and problem-solving.
          </p>
          <div className="space-y-4">
            {contactInfo.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <c.icon className="h-4 w-4" />
                </div>
                <span className="text-sm">{c.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" placeholder="Your name" required className="bg-muted/50 border-border/50" />
            <Input name="email" type="email" placeholder="Your email" required className="bg-muted/50 border-border/50" />
          </div>
          <Input name="subject" placeholder="Subject" required className="bg-muted/50 border-border/50" />
          <Textarea name="message" placeholder="Your message" rows={5} required className="bg-muted/50 border-border/50 resize-none" />
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;