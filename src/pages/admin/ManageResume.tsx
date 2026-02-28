import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

export default function ManageResume() {
  const [currentResume, setCurrentResume] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResumeUrl();
  }, []);

  const fetchResumeUrl = async () => {
    const { data, error } = await supabase.from("settings").select("value").eq("key", "resume_url").single();
    if (data) setCurrentResume(data.value);
    setLoading(false);
  };

  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an file to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Add a timestamp to the filename so browsers don't cache the old one when you update it!
      const fileName = `resume-${Date.now()}.${fileExt}`;

      // 1. Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL for the file
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

      // 3. Save the URL to our database
      const { error: dbError } = await supabase.from("settings")
        .update({ value: publicUrlData.publicUrl })
        .eq("key", "resume_url");

      if (dbError) throw dbError;

      setCurrentResume(publicUrlData.publicUrl);
      toast.success("Resume updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold">Manage Resume</h2>
        <p className="text-sm text-muted-foreground">Upload your latest PDF resume here.</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        {currentResume ? (
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md border border-border">
            <FileText className="text-primary h-6 w-6" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium">Current Resume Active</p>
              <a href={currentResume} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block">
                {currentResume}
              </a>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
        )}

        <div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 border-muted-foreground/25 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              )}
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF (MAX. 5MB)</p>
            </div>
            <input type="file" className="hidden" accept=".pdf" onChange={uploadResume} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}
