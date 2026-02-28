import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Skill = { id: string; name: string; category: string; };
const defaultSkill = { name: "", category: "Frontend" };

export default function ManageSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill>>(defaultSkill);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data } = await supabase.from("skills").select("*").order("category", { ascending: true });
    setSkills(data || []);
    setLoading(false);
  };

  const saveSkill = async () => {
    setSaving(true);
    const { id, ...payload } = currentSkill;
    if (editId) {
      await supabase.from("skills").update(payload).eq("id", editId);
      toast.success("Updated!");
    } else {
      await supabase.from("skills").insert([payload]);
      toast.success("Added!");
    }
    setSaving(false); setIsEditing(false); fetchSkills();
  };

  const deleteSkill = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("skills").delete().eq("id", id);
    fetchSkills();
  };

  const openEditor = (skill: Skill | null) => {
    setCurrentSkill(skill || defaultSkill); setEditId(skill?.id || null); setIsEditing(true);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  if (isEditing) return (
    <div className="space-y-4 max-w-xl">
      <Button variant="ghost" onClick={() => setIsEditing(false)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
      <Input placeholder="Skill Name (e.g. React)" value={currentSkill.name || ""} onChange={e => setCurrentSkill({...currentSkill, name: e.target.value})} />
      <Input placeholder="Category (e.g. Frontend, Backend, Tools)" value={currentSkill.category || ""} onChange={e => setCurrentSkill({...currentSkill, category: e.target.value})} />
      <Button onClick={saveSkill} disabled={saving}>{saving ? "Saving..." : "Save Skill"}</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Manage Skills</h2>
        <Button onClick={() => openEditor(null)}><Plus className="mr-2 h-4 w-4"/> Add</Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {skills.map(skill => (
          <div key={skill.id} className="flex justify-between items-center rounded-lg border bg-card p-3">
            <div><p className="font-bold text-sm">{skill.name}</p><p className="text-xs text-muted-foreground">{skill.category}</p></div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditor(skill)}><Edit2 className="h-3 w-3"/></Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteSkill(skill.id)}><Trash2 className="h-3 w-3"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
