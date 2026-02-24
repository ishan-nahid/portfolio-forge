import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Edit2 } from "lucide-react";

type Profile = {
  id: string;
  full_name: string;
  role: string;
  bio: string;
  github_url: string;
  linkedin_url: string;
};

type Skill = { id: string; name: string; icon_name?: string; category: string };
type Project = { id: string; title: string; description: string; github_url: string; live_url: string; image_url: string };
type Experience = { id: string; company: string; role: string; start_date: string; end_date: string; description: string };
type Education = { id: string; degree: string; institution: string; start_date: string; end_date: string; description: string };
type Certification = { id: string; title: string; issuer: string; date_earned: string; url: string };

const defaultSkillForm = { name: "", icon_name: "", category: "Frontend" };
const defaultProjectForm = { title: "", description: "", github_url: "", live_url: "", image_url: "" };
const defaultExperienceForm = { company: "", role: "", start_date: "", end_date: "", description: "" };
const defaultEducationForm = { degree: "", institution: "", start_date: "", end_date: "", description: "" };
const defaultCertificationForm = { title: "", issuer: "", date_earned: "", url: "" };

export default function Admin() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState<Profile>({ id: "", full_name: "", role: "", bio: "", github_url: "", linkedin_url: "" });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [skillForm, setSkillForm] = useState(defaultSkillForm);
  const [projectForm, setProjectForm] = useState(defaultProjectForm);
  const [experienceForm, setExperienceForm] = useState(defaultExperienceForm);
  const [educationForm, setEducationForm] = useState(defaultEducationForm);
  const [certificationForm, setCertificationForm] = useState(defaultCertificationForm);

  const [editIds, setEditIds] = useState<{ skill: string | null; project: string | null; experience: string | null; education: string | null; certification: string | null }>({
    skill: null,
    project: null,
    experience: null,
    education: null,
    certification: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const [profRes, skillRes, projRes, expRes, eduRes, certRes] = await Promise.all([
      supabase.from("profile").select("*").limit(1).single(),
      supabase.from("skills").select("*").order("category"),
      supabase.from("projects").select("*").order("id"),
      supabase.from("experience").select("*").order("start_date", { ascending: false }),
      supabase.from("education").select("*").order("start_date", { ascending: false }),
      supabase.from("certifications").select("*").order("date_earned", { ascending: false }),
    ]);

    if (profRes.data) setProfile(profRes.data as Profile);
    setSkills((skillRes.data ?? []) as Skill[]);
    setProjects((projRes.data ?? []) as Project[]);
    setExperience((expRes.data ?? []) as Experience[]);
    setEducation((eduRes.data ?? []) as Education[]);
    setCertifications((certRes.data ?? []) as Certification[]);
    setLoading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from("profile").update(profile).eq("id", profile.id);
    setSaving(false);
  };

  const saveItem = async (
    table: string,
    form: Record<string, unknown>,
    editId: string | null,
    setFormFn: (value: Record<string, unknown>) => void,
    defaultForm: Record<string, unknown>,
    resetEditKey: keyof typeof editIds,
  ) => {
    setSaving(true);
    if (editId) {
      await supabase.from(table).update(form).eq("id", editId);
    } else {
      await supabase.from(table).insert([form]);
    }

    setFormFn(defaultForm);
    setEditIds((prev) => ({ ...prev, [resetEditKey]: null }));
    await fetchAllData();
    setSaving(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm(`Delete this item from ${table}?`)) return;
    await supabase.from(table).delete().eq("id", id);
    await fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card/70 p-6 shadow-2xl backdrop-blur">
        <h1 className="mb-6 text-3xl font-bold text-foreground">Portfolio Admin Dashboard</h1>

        <div className="mb-8 flex space-x-2 overflow-x-auto border-b border-border pb-px">
          {["profile", "projects", "skills", "experience", "education", "certifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize px-5 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-primary bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="grid max-w-2xl gap-4 animate-in fade-in">
            <h2 className="border-b border-border pb-2 text-xl font-semibold text-foreground">Profile Details</h2>
            <div><label className="mb-1 block text-sm">Full Name</label><input className="w-full rounded border border-border bg-background p-2" value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
            <div><label className="mb-1 block text-sm">Role</label><input className="w-full rounded border border-border bg-background p-2" value={profile.role || ""} onChange={(e) => setProfile({ ...profile, role: e.target.value })} /></div>
            <div><label className="mb-1 block text-sm">Bio</label><textarea className="h-24 w-full rounded border border-border bg-background p-2" value={profile.bio || ""} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="mb-1 block text-sm">GitHub URL</label><input className="w-full rounded border border-border bg-background p-2" value={profile.github_url || ""} onChange={(e) => setProfile({ ...profile, github_url: e.target.value })} /></div>
              <div><label className="mb-1 block text-sm">LinkedIn URL</label><input className="w-full rounded border border-border bg-background p-2" value={profile.linkedin_url || ""} onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })} /></div>
            </div>
            <button onClick={saveProfile} disabled={saving} className="mt-2 w-full rounded bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="grid gap-8 animate-in fade-in md:grid-cols-3">
            <div className="space-y-4 rounded border border-border bg-secondary/40 p-4">
              <h2 className="border-b border-border pb-2 font-semibold">{editIds.project ? "Edit Project" : "New Project"}</h2>
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Project Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
              <textarea className="h-24 w-full rounded border border-border bg-background p-2" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="GitHub URL" value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Live URL" value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Image URL" value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} />
              <button onClick={() => saveItem("projects", projectForm, editIds.project, setProjectForm, defaultProjectForm, "project")} className="w-full rounded bg-primary py-2 text-primary-foreground">{saving ? "Saving..." : "Save Project"}</button>
              {editIds.project && <button onClick={() => { setEditIds((p) => ({ ...p, project: null })); setProjectForm(defaultProjectForm); }} className="w-full text-sm text-muted-foreground">Cancel</button>}
            </div>
            <div className="space-y-3 md:col-span-2">
              {projects.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border border-border bg-card p-4">
                  <div><p className="font-bold text-foreground">{item.title}</p><p className="text-sm text-muted-foreground">{item.description?.substring(0, 75)}...</p></div>
                  <div className="flex space-x-2">
                    <button onClick={() => { setProjectForm(item); setEditIds((p) => ({ ...p, project: item.id })); }} className="p-2 text-blue-400"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteItem("projects", item.id)} className="p-2 text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "skills" && (
          <div className="grid gap-8 animate-in fade-in md:grid-cols-3">
            <div className="space-y-4 rounded border border-border bg-secondary/40 p-4">
              <h2 className="border-b border-border pb-2 font-semibold">{editIds.skill ? "Edit Skill" : "New Skill"}</h2>
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Skill Name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
              <select className="w-full rounded border border-border bg-background p-2" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Tools">Tools</option>
                <option value="Other">Other</option>
              </select>
              <button onClick={() => saveItem("skills", skillForm, editIds.skill, setSkillForm, defaultSkillForm, "skill")} className="w-full rounded bg-primary py-2 text-primary-foreground">{saving ? "Saving..." : "Save Skill"}</button>
              {editIds.skill && <button onClick={() => { setEditIds((p) => ({ ...p, skill: null })); setSkillForm(defaultSkillForm); }} className="w-full text-sm text-muted-foreground">Cancel</button>}
            </div>
            <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
              {skills.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded border border-border bg-card p-3">
                  <div><p className="font-semibold text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.category}</p></div>
                  <div className="flex">
                    <button onClick={() => { setSkillForm(item); setEditIds((p) => ({ ...p, skill: item.id })); }} className="p-1 text-blue-400"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteItem("skills", item.id)} className="p-1 text-red-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "experience" && (
          <div className="grid gap-8 animate-in fade-in md:grid-cols-3">
            <div className="space-y-4 rounded border border-border bg-secondary/40 p-4">
              <h2 className="border-b border-border pb-2 font-semibold">{editIds.experience ? "Edit Role" : "New Role"}</h2>
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Company Name" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Role" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full rounded border border-border bg-background p-2" placeholder="Start" value={experienceForm.start_date} onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })} />
                <input className="w-full rounded border border-border bg-background p-2" placeholder="End" value={experienceForm.end_date} onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })} />
              </div>
              <textarea className="h-20 w-full rounded border border-border bg-background p-2" placeholder="Description" value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
              <button onClick={() => saveItem("experience", experienceForm, editIds.experience, setExperienceForm, defaultExperienceForm, "experience")} className="w-full rounded bg-primary py-2 text-primary-foreground">{saving ? "Saving..." : "Save Experience"}</button>
              {editIds.experience && <button onClick={() => { setEditIds((p) => ({ ...p, experience: null })); setExperienceForm(defaultExperienceForm); }} className="w-full text-sm text-muted-foreground">Cancel</button>}
            </div>
            <div className="space-y-3 md:col-span-2">
              {experience.map((item) => (
                <div key={item.id} className="rounded border border-border bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div><h3 className="text-lg font-bold text-foreground">{item.role}</h3><p className="font-medium text-primary">{item.company}</p></div>
                    <div className="flex space-x-2"><button onClick={() => { setExperienceForm(item); setEditIds((p) => ({ ...p, experience: item.id })); }} className="p-1 text-blue-400"><Edit2 className="h-4 w-4" /></button><button onClick={() => deleteItem("experience", item.id)} className="p-1 text-red-400"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{item.start_date} - {item.end_date}</p>
                  <p className="text-sm text-foreground/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "education" && (
          <div className="grid gap-8 animate-in fade-in md:grid-cols-3">
            <div className="space-y-4 rounded border border-border bg-secondary/40 p-4">
              <h2 className="border-b border-border pb-2 font-semibold">{editIds.education ? "Edit Education" : "New Education"}</h2>
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Degree" value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Institution" value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="w-full rounded border border-border bg-background p-2" placeholder="Start" value={educationForm.start_date} onChange={(e) => setEducationForm({ ...educationForm, start_date: e.target.value })} />
                <input className="w-full rounded border border-border bg-background p-2" placeholder="End" value={educationForm.end_date} onChange={(e) => setEducationForm({ ...educationForm, end_date: e.target.value })} />
              </div>
              <textarea className="h-20 w-full rounded border border-border bg-background p-2" placeholder="Description" value={educationForm.description} onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })} />
              <button onClick={() => saveItem("education", educationForm, editIds.education, setEducationForm, defaultEducationForm, "education")} className="w-full rounded bg-primary py-2 text-primary-foreground">{saving ? "Saving..." : "Save Education"}</button>
              {editIds.education && <button onClick={() => { setEditIds((p) => ({ ...p, education: null })); setEducationForm(defaultEducationForm); }} className="w-full text-sm text-muted-foreground">Cancel</button>}
            </div>
            <div className="space-y-3 md:col-span-2">
              {education.map((item) => (
                <div key={item.id} className="rounded border border-border bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div><h3 className="text-lg font-bold text-foreground">{item.degree}</h3><p className="font-medium text-primary">{item.institution}</p></div>
                    <div className="flex space-x-2"><button onClick={() => { setEducationForm(item); setEditIds((p) => ({ ...p, education: item.id })); }} className="p-1 text-blue-400"><Edit2 className="h-4 w-4" /></button><button onClick={() => deleteItem("education", item.id)} className="p-1 text-red-400"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{item.start_date} - {item.end_date}</p>
                  <p className="text-sm text-foreground/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certifications" && (
          <div className="grid gap-8 animate-in fade-in md:grid-cols-3">
            <div className="space-y-4 rounded border border-border bg-secondary/40 p-4">
              <h2 className="border-b border-border pb-2 font-semibold">{editIds.certification ? "Edit Certification" : "New Certification"}</h2>
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Title" value={certificationForm.title} onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Issuer" value={certificationForm.issuer} onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Date Earned" value={certificationForm.date_earned} onChange={(e) => setCertificationForm({ ...certificationForm, date_earned: e.target.value })} />
              <input className="w-full rounded border border-border bg-background p-2" placeholder="Credential URL" value={certificationForm.url} onChange={(e) => setCertificationForm({ ...certificationForm, url: e.target.value })} />
              <button onClick={() => saveItem("certifications", certificationForm, editIds.certification, setCertificationForm, defaultCertificationForm, "certification")} className="w-full rounded bg-primary py-2 text-primary-foreground">{saving ? "Saving..." : "Save Certification"}</button>
              {editIds.certification && <button onClick={() => { setEditIds((p) => ({ ...p, certification: null })); setCertificationForm(defaultCertificationForm); }} className="w-full text-sm text-muted-foreground">Cancel</button>}
            </div>
            <div className="space-y-3 md:col-span-2">
              {certifications.map((item) => (
                <div key={item.id} className="flex items-start justify-between rounded border border-border bg-card p-4">
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="text-sm text-primary">{item.issuer}</p>
                    <p className="text-xs text-muted-foreground">Earned {item.date_earned}</p>
                    {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground underline hover:text-primary">View credential</a>}
                  </div>
                  <div className="flex space-x-2"><button onClick={() => { setCertificationForm(item); setEditIds((p) => ({ ...p, certification: item.id })); }} className="p-1 text-blue-400"><Edit2 className="h-4 w-4" /></button><button onClick={() => deleteItem("certifications", item.id)} className="p-1 text-red-400"><Trash2 className="h-4 w-4" /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
