import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States
  const [profile, setProfile] = useState({ id: "", full_name: "", role: "", bio: "", github_url: "", linkedin_url: "" });
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);

  // Forms
  const [skillForm, setSkillForm] = useState({ name: "", icon_name: "", category: "Frontend" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", github_url: "", live_url: "", image_url: "" });
  const [experienceForm, setExperienceForm] = useState({ company: "", role: "", start_date: "", end_date: "", description: "" });

  // Edit IDs
  const [editIds, setEditIds] = useState({ skill: null, project: null, experience: null });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const [profRes, skillRes, projRes, expRes] = await Promise.all([
      supabase.from("profile").select("*").limit(1).single(),
      supabase.from("skills").select("*").order("category"),
      supabase.from("projects").select("*").order("id"),
      supabase.from("experience").select("*").order("start_date", { ascending: false })
    ]);

    if (profRes.data) setProfile(profRes.data);
    if (skillRes.data) setSkills(skillRes.data);
    if (projRes.data) setProjects(projRes.data);
    if (expRes.data) setExperience(expRes.data);
    setLoading(false);
  };

  // --- SAVE HANDLERS ---
  const saveProfile = async () => {
    setSaving(true);
    await supabase.from("profile").update(profile).eq("id", profile.id);
    alert("Profile saved!");
    setSaving(false);
  };

  const saveItem = async (table: string, form: any, editId: any, setFormFn: any, defaultForm: any, resetEditFn: string) => {
    setSaving(true);
    if (editId) {
      await supabase.from(table).update(form).eq("id", editId);
    } else {
      await supabase.from(table).insert([form]);
    }
    setFormFn(defaultForm);
    setEditIds({ ...editIds, [resetEditFn]: null });
    fetchAllData();
    setSaving(false);
  };

  // --- DELETE HANDLER ---
  const deleteItem = async (table: string, id: string) => {
    if (!confirm(`Delete this item from ${table}?`)) return;
    await supabase.from(table).delete().eq("id", id);
    fetchAllData();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 border">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Portfolio Command Center</h1>

        {/* TABS */}
        <div className="flex space-x-2 mb-8 border-b pb-px overflow-x-auto">
          {["profile", "projects", "skills", "experience"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`capitalize px-6 py-3 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${ activeTab === tab ? "bg-gray-100 border-b-2 border-black text-black" : "text-gray-500 hover:text-black hover:bg-gray-50" }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="grid gap-4 max-w-2xl animate-in fade-in">
            <h2 className="text-xl font-semibold border-b pb-2">Profile Details</h2>
            <div><label className="block text-sm font-medium mb-1">Full Name</label><input className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none" value={profile.full_name || ""} onChange={e => setProfile({...profile, full_name: e.target.value})} /></div>
            <div><label className="block text-sm font-medium mb-1">Role</label><input className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none" value={profile.role || ""} onChange={e => setProfile({...profile, role: e.target.value})} /></div>
            <div><label className="block text-sm font-medium mb-1">Bio</label><textarea className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-black outline-none" value={profile.bio || ""} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">GitHub URL</label><input className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none" value={profile.github_url || ""} onChange={e => setProfile({...profile, github_url: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1">LinkedIn URL</label><input className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none" value={profile.linkedin_url || ""} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} /></div>
            </div>
            <button onClick={saveProfile} disabled={saving} className="bg-black text-white px-4 py-2 rounded font-medium hover:bg-gray-800 w-full sm:w-auto mt-2">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="grid md:grid-cols-3 gap-8 animate-in fade-in">
            <div className="space-y-4 bg-gray-50 p-4 rounded border">
              <h2 className="font-semibold border-b pb-2">{editIds.project ? "Edit Project" : "New Project"}</h2>
              <input className="w-full border p-2 rounded" placeholder="Title" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
              <textarea className="w-full border p-2 rounded h-20" placeholder="Description" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="GitHub URL" value={projectForm.github_url} onChange={e => setProjectForm({...projectForm, github_url: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Live URL" value={projectForm.live_url} onChange={e => setProjectForm({...projectForm, live_url: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Image URL" value={projectForm.image_url} onChange={e => setProjectForm({...projectForm, image_url: e.target.value})} />
              <button onClick={() => saveItem("projects", projectForm, editIds.project, setProjectForm, {title:"", description:"", github_url:"", live_url:"", image_url:""}, "project")} className="w-full bg-black text-white py-2 rounded">{saving ? "Saving..." : "Save Project"}</button>
              {editIds.project && <button onClick={() => {setEditIds({...editIds, project: null}); setProjectForm({title:"", description:"", github_url:"", live_url:"", image_url:""})}} className="w-full text-sm text-gray-500 mt-2">Cancel</button>}
            </div>
            <div className="md:col-span-2 space-y-3">
              {projects.map(p => (
                <div key={p.id} className="p-4 border rounded flex justify-between items-center bg-white">
                  <div><p className="font-bold">{p.title}</p><p className="text-sm text-gray-500">{p.description?.substring(0, 50)}...</p></div>
                  <div className="flex space-x-2">
                    <button onClick={() => {setProjectForm(p); setEditIds({...editIds, project: p.id})}} className="text-blue-600 p-2"><Edit2 className="w-4 h-4"/></button>
                    <button onClick={() => deleteItem("projects", p.id)} className="text-red-600 p-2"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div className="grid md:grid-cols-3 gap-8 animate-in fade-in">
            <div className="space-y-4 bg-gray-50 p-4 rounded border">
              <h2 className="font-semibold border-b pb-2">{editIds.skill ? "Edit Skill" : "New Skill"}</h2>
              <input className="w-full border p-2 rounded" placeholder="Skill Name" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} />
              <select className="w-full border p-2 rounded" value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})}>
                <option value="Frontend">Frontend</option><option value="Backend">Backend</option><option value="Tools">Tools</option><option value="Other">Other</option>
              </select>
              <button onClick={() => saveItem("skills", skillForm, editIds.skill, setSkillForm, {name:"", icon_name:"", category:"Frontend"}, "skill")} className="w-full bg-black text-white py-2 rounded">{saving ? "Saving..." : "Save Skill"}</button>
              {editIds.skill && <button onClick={() => {setEditIds({...editIds, skill: null}); setSkillForm({name:"", icon_name:"", category:"Frontend"})}} className="w-full text-sm text-gray-500 mt-2">Cancel</button>}
            </div>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-3">
              {skills.map(s => (
                <div key={s.id} className="p-3 border rounded flex justify-between items-center bg-white">
                  <div><p className="font-semibold">{s.name}</p><p className="text-xs text-gray-500">{s.category}</p></div>
                  <div className="flex"><button onClick={() => {setSkillForm(s); setEditIds({...editIds, skill: s.id})}} className="text-blue-600 p-1"><Edit2 className="w-4 h-4"/></button><button onClick={() => deleteItem("skills", s.id)} className="text-red-600 p-1"><Trash2 className="w-4 h-4"/></button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div className="grid md:grid-cols-3 gap-8 animate-in fade-in">
            <div className="space-y-4 bg-gray-50 p-4 rounded border">
              <h2 className="font-semibold border-b pb-2">{editIds.experience ? "Edit Role" : "New Role"}</h2>
              <input className="w-full border p-2 rounded" placeholder="Company Name" value={experienceForm.company} onChange={e => setExperienceForm({...experienceForm, company: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Job Title / Role" value={experienceForm.role} onChange={e => setExperienceForm({...experienceForm, role: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full border p-2 rounded" placeholder="Start (e.g. 2021)" value={experienceForm.start_date} onChange={e => setExperienceForm({...experienceForm, start_date: e.target.value})} />
                <input className="w-full border p-2 rounded" placeholder="End (e.g. Present)" value={experienceForm.end_date} onChange={e => setExperienceForm({...experienceForm, end_date: e.target.value})} />
              </div>
              <textarea className="w-full border p-2 rounded h-20" placeholder="Description of what you did..." value={experienceForm.description} onChange={e => setExperienceForm({...experienceForm, description: e.target.value})} />
              <button onClick={() => saveItem("experience", experienceForm, editIds.experience, setExperienceForm, {company:"", role:"", start_date:"", end_date:"", description:""}, "experience")} className="w-full bg-black text-white py-2 rounded">{saving ? "Saving..." : "Save Experience"}</button>
              {editIds.experience && <button onClick={() => {setEditIds({...editIds, experience: null}); setExperienceForm({company:"", role:"", start_date:"", end_date:"", description:""})}} className="w-full text-sm text-gray-500 mt-2">Cancel</button>}
            </div>
            <div className="md:col-span-2 space-y-3">
              {experience.map(exp => (
                <div key={exp.id} className="p-4 border rounded bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div><h3 className="font-bold text-lg">{exp.role}</h3><p className="text-blue-600 font-medium">{exp.company}</p></div>
                    <div className="flex space-x-2"><button onClick={() => {setExperienceForm(exp); setEditIds({...editIds, experience: exp.id})}} className="text-blue-600 p-1"><Edit2 className="w-4 h-4"/></button><button onClick={() => deleteItem("experience", exp.id)} className="text-red-600 p-1"><Trash2 className="w-4 h-4"/></button></div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{exp.start_date} - {exp.end_date}</p>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
