import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

type Profile = { id: string; full_name: string; role: string; bio: string; github_url: string; linkedin_url: string; };

export default function ManageProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profile").select("*").limit(1).single();
      if (data) setProfile(data as Profile);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await supabase.from("profile").update(profile).eq("id", profile.id);
    setSaving(false);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Manage Profile</h2>
        <p className="text-sm text-muted-foreground">Update your core portfolio details here.</p>
      </div>

      {profile && (
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <Input value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Role (Headline)</label>
            <Input value={profile.role || ""} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea className="h-32 w-full rounded-md border border-border bg-background p-3 text-sm" value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">GitHub URL</label>
              <Input value={profile.github_url || ""} onChange={(e) => setProfile({ ...profile, github_url: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">LinkedIn URL</label>
              <Input value={profile.linkedin_url || ""} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} />
            </div>
          </div>
          <Button onClick={saveProfile} disabled={saving} className="w-fit">
            {saving ? "Saving..." : "Save Profile Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
