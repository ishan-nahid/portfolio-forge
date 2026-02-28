import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [profileRes, postRes] = await Promise.all([
        supabase.from("profile").select("*").limit(1).maybeSingle(),
        supabase.from("blogs").select("*").eq("slug", slug).single(),
      ]);

      setProfile(profileRes.data ?? null);
      if (postRes.data) setPost(postRes.data);
      setIsLoading(false);
    }

    if (slug) fetchData();
  }, [slug]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header profile={isLoading ? null : profile} />

      <main className="flex-grow max-w-3xl mx-auto w-full px-6 pt-32 pb-24">
        <div className="mb-12">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to writing
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full md:w-3/4" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full mt-12" />
          </div>
        ) : !post ? (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground">The article you are looking for does not exist.</p>
          </div>
        ) : (
          <motion.article 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <header className="mb-14">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-3 text-muted-foreground font-mono text-sm">
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
                {post.read_time && (
                  <>
                    <span>—</span>
                    <span>{post.read_time}</span>
                  </>
                )}
              </div>
            </header>

            {/* Content Area */}
            <div className="prose prose-neutral dark:prose-invert md:prose-lg max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </motion.article>
        )}
      </main>

      <Footer profile={isLoading ? null : profile} />
    </div>
  );
};

export default BlogPost;
