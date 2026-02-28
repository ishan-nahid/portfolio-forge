import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setPost(data);
      }
      setIsLoading(false);
    };

    if (slug) fetchPost();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 pt-32 pb-20">
        <div className="mb-10">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to all posts
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-64 w-full mt-8" />
          </div>
        ) : !post ? (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground">The article you are looking for doesn't exist.</p>
          </div>
        ) : (
          <motion.article 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="prose prose-neutral dark:prose-invert md:prose-lg max-w-none"
          >
            <header className="mb-12 not-prose">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground">
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
                {post.read_time && (
                  <>
                    <span>·</span>
                    <span>{post.read_time}</span>
                  </>
                )}
              </div>
            </header>

            {/* If using a Markdown parser later, you'd render it here. For now, we render plain text/html */}
            <div className="leading-loose text-lg text-foreground/90 whitespace-pre-wrap">
              {post.content}
            </div>
          </motion.article>
        )}
      </main>

      <Footer />
    </div>
  );
}
