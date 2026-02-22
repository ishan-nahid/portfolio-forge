import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Profile = {
  id?: string;
  full_name: string;
  role: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  email: string;
  github_url: string;
  linkedin_url: string;
};

const emptyProfile: Profile = {
  full_name: "",
  role: "",
  bio: "",
  avatar_url: "",
  resume_url: "",
  email: "",
  github_url: "",
  linkedin_url: "",
};

export function ProfileTab() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profile").select("*").limit(1).single();
      if (data) {
        setProfile(data);
        setExistingId(data.id);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { id, ...rest } = profile;

    if (existingId) {
      const { error } = await supabase.from("profile").update(rest).eq("id", existingId);
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Profile updated" });
      }
    } else {
      const { data, error } = await supabase.from("profile").insert([rest]).select().single();
      if (error) {
        toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      } else {
        setExistingId(data.id);
        toast({ title: "Profile created" });
      }
    }
    setSaving(false);
  };

  const update = (field: keyof Profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading profile…
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={profile.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Role / Title</Label>
            <Input value={profile.role} onChange={(e) => update("role", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Bio</Label>
          <Textarea rows={4} value={profile.bio} onChange={(e) => update("bio", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Avatar URL</Label>
            <Input value={profile.avatar_url} onChange={(e) => update("avatar_url", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Resume URL</Label>
            <Input value={profile.resume_url} onChange={(e) => update("resume_url", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input value={profile.github_url} onChange={(e) => update("github_url", e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input value={profile.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
}
