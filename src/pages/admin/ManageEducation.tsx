import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type Education = { id: string; institution: string; degree: string; duration: string; description: string; };
const defaultEdu = { institution: "", degree: "", duration: "", description: "" };

export default function ManageEducation() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdu, setCurrentEdu] = useState<Partial<Education>>(defaultEdu);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { fetchEducation(); }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data } = await supabase.from("education").select("*").order("id", { ascending: false });
    setEducation(data || []);
    setLoading(false);
  };

  const saveEducation = async () => {
    setSaving(true);
    const { id, ...payload } = currentEdu;
    if (editId) {
      await supabase.from("education").update(payload).eq("id", editId);
      toast.success("Updated!");
    } else {
      await supabase.from("education").insert([payload]);
      toast.success("Added!");
    }
    setSaving(false); setIsEditing(false); fetchEducation();
  };

  const deleteEducation = async (id: string) => {
    if (!confirm("Delete this?")) return;
    await supabase.from("education").delete().eq("id", id);
    fetchEducation();
  };

  const openEditor = (edu: Education | null) => {
    setCurrentEdu(edu || defaultEdu); setEditId(edu?.id || null); setIsEditing(true);
  };

  if (loading) return <Loader2 className="h-6 w-6 animate-spin text-primary" />;

  if (isEditing) return (
    <div className="space-y-4 max-w-2xl">
      <Button variant="ghost" onClick={() => setIsEditing(false)}><ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
      <Input placeholder="Institution" value={currentEdu.institution || ""} onChange={e => setCurrentEdu({...currentEdu, institution: e.target.value})} />
      <Input placeholder="Degree" value={currentEdu.degree || ""} onChange={e => setCurrentEdu({...currentEdu, degree: e.target.value})} />
      <Input placeholder="Duration" value={currentEdu.duration || ""} onChange={e => setCurrentEdu({...currentEdu, duration: e.target.value})} />
      <textarea className="h-32 w-full rounded-md border p-3" placeholder="Description" value={currentEdu.description || ""} onChange={e => setCurrentEdu({...currentEdu, description: e.target.value})} />
      <Button onClick={saveEducation} disabled={saving}>{saving ? "Saving..." : "Save Education"}</Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Manage Education</h2>
        <Button onClick={() => openEditor(null)}><Plus className="mr-2 h-4 w-4"/> Add</Button>
      </div>
      <div className="grid gap-4">
        {education.map(edu => (
          <div key={edu.id} className="flex justify-between rounded-lg border bg-card p-4">
            <div><h3 className="font-bold">{edu.degree}</h3><p className="text-sm text-muted-foreground">{edu.institution} ({edu.duration})</p></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => openEditor(edu)}><Edit2 className="h-4 w-4"/></Button>
              <Button variant="ghost" size="icon" onClick={() => deleteEducation(edu.id)} className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
