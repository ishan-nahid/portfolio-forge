import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, Briefcase, GraduationCap, Code2, Award, FileText, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Projects", href: "/admin/projects", icon: Code2 },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Skills", href: "/admin/skills", icon: Award },
  { name: "Resume", href: "/admin/resume", icon: FileText },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="font-mono text-lg font-bold text-primary hover:opacity-80">
            &lt;IA /&gt; Admin
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 w-full px-4">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-card/70 p-6 shadow-2xl backdrop-blur">
          {/* Outlet is where the nested routes (like ManageProfile) will render */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}
