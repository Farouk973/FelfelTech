import {
  ChevronDown,
  ExternalLink,
  Github,
  LayoutGrid,
  ListChecks,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "features", label: "Features", icon: ListChecks },
  { id: "details", label: "Details", icon: Sparkles },
  { id: "stack", label: "Tech Stack", icon: Wrench },
];

const emptyState = {
  title: "No content yet",
  description: "More information coming soon.",
};

export const ProjectModal = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [openSections, setOpenSections] = useState({});

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
    setOpenSections({});
  }, [project]);

  if (!project) return null;

  const hasSections = project.sections && project.sections.length > 0;
  const hasStack = project.techStack && project.techStack.length > 0;
  const hasFeatures = project.features && project.features.length > 0;

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-backdrop-in"
      onClick={onClose}
    >
      <div
        className="relative bg-card rounded-2xl max-w-4xl w-full max-h-[88vh] shadow-2xl border border-border overflow-hidden flex flex-col animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between p-4 sm:p-5 border-b border-border/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_2px] shadow-primary/40 shrink-0" />
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
          {TABS.filter((tab) => tab.id !== "features" || hasFeatures).map((tab) => {
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
            <div className="grid gap-5 sm:grid-cols-[260px_1fr] sm:items-start">
              <div className="w-full rounded-xl overflow-hidden bg-secondary/40 border border-border/40 sm:sticky sm:top-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto max-h-64 sm:max-h-none object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/projects/project1.png";
                  }}
                />
              </div>
              <div className="space-y-5">
                <p className="text-foreground/80 text-sm sm:text-base leading-relaxed">
                  {project.detailedDescription}
                </p>
                {project.links ? (
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
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
                    {emptyState.description}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "features" &&
            (hasFeatures ? (
              <div className="space-y-4">
                {project.features.map((group, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/50 bg-secondary/20 overflow-hidden"
                  >
                    <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-2">
                      <h4 className="font-semibold flex items-center gap-2 text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {group.category}
                      </h4>
                    </div>
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <ul className="space-y-2">
                        {group.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed"
                          >
                            <span className="text-primary mt-1">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
                {emptyState.description}
              </div>
            ))}

          {activeTab === "details" && (
            <div className="space-y-3">
              {hasSections ? (
                project.sections.map((section, i) => {
                  const isOpen = openSections[i] ?? i === 0;
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-border/50 bg-secondary/20 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(i)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-secondary/40 transition-colors"
                      >
                        <h4 className="font-semibold flex items-center gap-2 text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {section.title}
                        </h4>
                        <ChevronDown
                          size={18}
                          className={cn(
                            "text-muted-foreground transition-transform duration-300 shrink-0",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      <div
                        className={cn(
                          "transition-all duration-300 overflow-hidden",
                          isOpen
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
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
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
                  {emptyState.description}
                </div>
              )}
            </div>
          )}

          {activeTab === "stack" &&
            (hasStack ? (
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
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground text-sm">
                {emptyState.description}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};