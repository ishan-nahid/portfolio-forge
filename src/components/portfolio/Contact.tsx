import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  message: "",
};

export function Contact() {
  const ref = useScrollReveal<HTMLElement>();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!accessKey) {
      toast({
        title: "Missing configuration",
        description: "Web3Forms access key is not set. Please add VITE_WEB3FORMS_KEY to your environment.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("access_key", accessKey);
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("message", formState.message);
      formData.append("subject", `Portfolio inquiry from ${formState.name}`);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message");
      }

      setFormState(initialFormState);
      toast({
        title: "Message sent",
        description: "Thanks for reaching out — I'll get back to you soon.",
      });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="reveal py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-primary">Contact</h2>
            <p className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Let's build something together</p>
            <p className="mb-10 text-muted-foreground">
              Have a project idea, collaboration, or opportunity in mind? Send me a message and I'll respond as soon as possible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto grid w-full max-w-2xl gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  className="border-border bg-background/70"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={formState.email}
                  onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                  className="border-border bg-background/70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                required
                minLength={20}
                rows={6}
                value={formState.message}
                onChange={(event) => setFormState((prev) => ({ ...prev, message: event.target.value }))}
                className="resize-none border-border bg-background/70"
              />
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full sm:w-auto sm:justify-self-end" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
