import { ExternalLink, Github, X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card/95 backdrop-blur border-b border-border">
          <h3 className="text-xl md:text-2xl font-bold">{project.title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="h-56 md:h-72 overflow-hidden rounded-lg mb-6">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-foreground/80 mb-6">{project.detailedDescription}</p>

          {project.techStack && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.sections &&
            project.sections.map((section, i) => (
              <div key={i} className="mb-6">
                <h4 className="text-lg font-semibold mb-2 text-primary">
                  {section.title}
                </h4>
                {section.paragraphs ? (
                  section.paragraphs.map((p, j) => (
                    <p key={j} className="text-foreground/80 mb-3 text-sm leading-relaxed">
                      {p}
                    </p>
                  ))
                ) : (
                  <ul className="space-y-2">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

          {project.links && (
            <div className="flex gap-4 mt-8">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="cosmic-button flex items-center gap-2"
              >
                {project.links[0]} <ExternalLink size={16} />
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "px-6 py-2 rounded-full border border-primary text-primary",
                  "font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground flex items-center gap-2"
                )}
              >
                {project.links[1]} <Github size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
