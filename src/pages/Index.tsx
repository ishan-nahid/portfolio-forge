import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Github, Linkedin, ExternalLink, Mail, Code, Briefcase, User } from "lucide-react";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);

  useEffect(() => {
    const fetchPublicData = async () => {
      const [profRes, projRes, skillRes, expRes] = await Promise.all([
        supabase.from("profile").select("*").limit(1).single(),
        supabase.from("projects").select("*").order("id"),
        supabase.from("skills").select("*").order("category"),
        supabase.from("experience").select("*").order("start_date", { ascending: false })
      ]);

      if (profRes.data) setProfile(profRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (skillRes.data) setSkills(skillRes.data);
      if (expRes.data) setExperience(expRes.data);
      setLoading(false);
    };

    fetchPublicData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading portfolio...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* HERO SECTION */}
      <header className="max-w-4xl mx-auto pt-24 pb-16 px-6 sm:px-8">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4">
          Hi, I'm <span className="text-blue-600">{profile?.full_name || "Developer"}</span>.
        </h1>
        <h2 className="text-2xl sm:text-3xl text-gray-600 font-medium mb-6">
          {profile?.role || "Software Engineer"}
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl leading-relaxed mb-8">
          {profile?.bio || "Welcome to my digital space. I build things for the web."}
        </p>
        <div className="flex space-x-4">
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" className="p-3 bg-gray-200 hover:bg-black hover:text-white rounded-full transition-colors">
              <Github className="w-5 h-5" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="p-3 bg-gray-200 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </header>

      {/* EXPERIENCE SECTION */}
      {experience.length > 0 && (
        <section className="max-w-4xl mx-auto py-16 px-6 sm:px-8 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-8">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold">Experience</h2>
          </div>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-8 sm:pl-0">
                <div className="sm:flex sm:justify-between sm:items-baseline mb-2">
                  <h3 className="text-xl font-bold">{exp.role} <span className="text-blue-600">@ {exp.company}</span></h3>
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 sm:mt-0 inline-block">
                    {exp.start_date} - {exp.end_date}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS SECTION */}
      {skills.length > 0 && (
        <section className="max-w-4xl mx-auto py-16 px-6 sm:px-8 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-8">
            <Code className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold">Skills</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span key={skill.id} className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-medium text-gray-800 hover:border-black transition-colors">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS SECTION */}
      {projects.length > 0 && (
        <section className="max-w-4xl mx-auto py-16 px-6 sm:px-8 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-8">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-3xl font-bold">Featured Projects</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                {project.image_url && (
                  <div className="h-48 w-full overflow-hidden bg-gray-100">
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">{project.description}</p>
                  <div className="flex items-center space-x-4">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-gray-700 hover:text-black">
                        <Github className="w-4 h-4 mr-1.5" /> Code
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto py-8 px-6 sm:px-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} {profile?.full_name || "Developer"}. Built with React & Supabase.</p>
      </footer>
    </div>
  );
}
