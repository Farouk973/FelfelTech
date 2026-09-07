import { ExternalLink, Github, LayoutGrid, Sparkles, Wrench, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "details", label: "Details", icon: Sparkles },
  { id: "stack", label: "Tech Stack", icon: Wrench },
];

export const ProjectModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!project) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  useEffect(() => {
    setActiveTab("overview");
  }, [project]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl max-w-4xl w-full max-h-[88vh] shadow-2xl border border-border overflow-hidden flex flex-col animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between p-4 sm:p-5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_2px] shadow-primary/40" />
            <h3 className="text-lg sm:text-xl font-bold truncate">{project.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-1 px-4 pt-4 sm:px-5 sm:pt-5 border-b border-border/60">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-t-lg text-sm font-medium transition-all duration-200 border-b-2 -mb-px",
                  active
                    ? "text-primary border-primary bg-secondary/30"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 1)}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="w-full rounded-xl overflow-hidden bg-secondary/40 border border-border/40">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto max-h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/projects/project1.png";
                  }}
                />
              </div>
              <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                {project.detailedDescription}
              </p>
              {project.links && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="cosmic-button flex items-center gap-2 text-sm"
                  >
                    {project.links[0]} <ExternalLink size={15} />
                  </a>
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "px-5 py-2 rounded-full border border-primary text-primary",
                        "font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center gap-2 text-sm"
                      )}
                    >
                      {project.links[1] || "GitHub"} <Github size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-5">
              {project.sections &&
                project.sections.map((section, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-secondary/20 p-4 sm:p-5"
                  >
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {section.title}
                    </h4>
                    {section.paragraphs ? (
                      <div className="space-y-2.5">
                        {section.paragraphs.map((p, j) => (
                          <p
                            key={j}
                            className="text-foreground/80 text-sm leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {section.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed"
                          >
                            <span className="text-primary mt-1">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          )}

          {activeTab === "stack" && (
            <div>
              {project.techStack && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-2.5 text-xs sm:text-sm font-medium rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/40 transition-colors flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
