import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Experience = { id: string; company: string; role: string; duration: string; description: string; };
const defaultExp = { company: "", role: "", duration: "", description: "" };

export default function ManageExperience() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>(defaultExp);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchExperience(); }, []);

  const fetchExperience = async () => {
    setLoading(true);
    const { data } = await supabase.from("experience").select("*").order("id", { ascending: false });
    setExperience(data || []);
    setLoading(false);
  };

  const saveExperience = async () => {
    setSaving(true);
    const { id, ...payload } = currentExp;
    if (editId) {
      const { error } = await supabase.from("experience").update(payload).eq("id", editId);
      if (error) toast.error(error.message); else toast.success("Updated!");
    } else {
      const { error } = await supabase.from("experience").insert([payload]);
      if (error) toast.error(error.message); else toast.success("Added!");
    }
    setSaving(false); setIsEditing(false); fetchExperience();
  };

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("experience").delete().eq("id", id);
    fetchExperience();
  };

  const openEditor = (exp: Experience | null) => {
    setCurrentExp(exp || defaultExp); setEditId(exp?.id || null); setIsEditing(true);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  if (isEditing) return (
    <div className="space-y-4 max-w-2xl">
      <Button variant="ghost" onClick={() => setIsEditing(false)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
      <Input placeholder="Company" value={currentExp.company || ""} onChange={e => setCurrentExp({...currentExp, company: e.target.value})} />
      <Input placeholder="Role (e.g. Frontend Dev)" value={currentExp.role || ""} onChange={e => setCurrentExp({...currentExp, role: e.target.value})} />
      <Input placeholder="Duration (e.g. 2021 - Present)" value={currentExp.duration || ""} onChange={e => setCurrentExp({...currentExp, duration: e.target.value})} />
      <textarea className="h-32 w-full rounded-md border p-3" placeholder="Description" value={currentExp.description || ""} onChange={e => setCurrentExp({...currentExp, description: e.target.value})} />
      <Button onClick={saveExperience} disabled={saving}>{saving ? "Saving..." : "Save Experience"}</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Manage Experience</h2>
        <Button onClick={() => openEditor(null)}><Plus className="mr-2 h-4 w-4"/> Add</Button>
      </div>
      <div className="grid gap-4">
        {experience.map(exp => (
          <div key={exp.id} className="flex justify-between rounded-lg border bg-card p-4">
            <div><h3 className="font-bold">{exp.role} at {exp.company}</h3><p className="text-sm text-muted-foreground">{exp.duration}</p></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditor(exp)}><Edit2 className="h-4 w-4"/></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteExperience(exp.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
