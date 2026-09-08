import { Database, Layout, Server, Wrench } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Frontend
  { name: "JavaScript", level: 90, category: "frontend" },
  { name: "TypeScript", level: 90, category: "frontend" },
  { name: "Angular", level: 90, category: "frontend" },
  { name: "React/Reactjs", level: 70, category: "frontend" },
  { name: "Flutter (Dart)", level: 80, category: "frontend" },
  { name: "Tailwind CSS", level: 70, category: "frontend" },
  { name: "HTML/CSS", level: 95, category: "frontend" },
  { name: "Bootstrap", level: 85, category: "frontend" },
  { name: "Symfony (Frontend)", level: 85, category: "frontend" },
  { name: "jQuery", level: 70, category: "frontend" },

  // Backend
  { name: "C#", level: 90, category: "backend" },
  { name: ".NET", level: 90, category: "backend" },
  { name: "PHP", level: 85, category: "backend" },
  { name: "Symfony (Backend)", level: 85, category: "backend" },
  { name: "Java", level: 90, category: "backend" },
  { name: "JavaEE", level: 90, category: "backend" },
  { name: "Spring Boot", level: 90, category: "backend" },
  { name: "Python", level: 70, category: "backend" },
  { name: "Node.js", level: 75, category: "backend" },
  { name: "JavaFX", level: 85, category: "backend" },
  { name: "GraphQL", level: 65, category: "backend" },

  // Databases
  { name: "MySQL", level: 90, category: "databases" },
  { name: "MongoDB", level: 90, category: "databases" },
  { name: "Firestore", level: 75, category: "databases" },
  { name: "InfluxDB", level: 80, category: "databases" },
  { name: "PostgreSQL", level: 65, category: "databases" },

  // Tools
  { name: "Git / GitHub", level: 95, category: "tools" },
  { name: "Docker / DockerHub", level: 80, category: "tools" },
  { name: "Jenkins", level: 75, category: "tools" },
  { name: "Azure DevOps", level: 95, category: "tools" },
  { name: "Azure Boards", level: 95, category: "tools" },
  { name: "Jira", level: 70, category: "tools" },
  { name: "Swagger", level: 85, category: "tools" },
  { name: "Postman", level: 85, category: "tools" },
  { name: "Figma", level: 85, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
  { name: "Visual Studio", level: 95, category: "tools" },
  { name: "Vagrant", level: 70, category: "tools" },
  { name: "Nexus", level: 70, category: "tools" },
  { name: "SonarQube", level: 85, category: "tools" },
  { name: "Grafana / Prometheus", level: 70, category: "tools" },
  { name: "NetBeans", level: 80, category: "tools" },
  { name: "IntelliJ IDEA", level: 85, category: "tools" },
  { name: "STS (Spring Tool Suite)", level: 70, category: "tools" },
];

const categories = [
  { id: "frontend", label: "Frontend", icon: Layout },
  { id: "backend", label: "Backend", icon: Server },
  { id: "databases", label: "Databases", icon: Database },
  { id: "tools", label: "Tools", icon: Wrench },
];

const getProficiency = (level) =>
  level >= 90 ? "Expert" : level >= 75 ? "Advanced" : "Proficient";

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");

  const filteredSkills = skills
    .filter((skill) => skill.category === activeCategory)
    .sort((a, b) => b.level - a.level);

  const activeIcon = categories.find((c) => c.id === activeCategory)?.icon;

  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Technologies and tools I work with every day.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            const count = skills.filter(
              (skill) => skill.category === category.id
            ).length;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                    : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:scale-105"
                )}
              >
                <Icon size={16} />
                {category.label}
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, key) => {
            const ActiveIcon = activeIcon;
            return (
              <div
                key={key}
                style={{ animationDelay: `${key * 40}ms` }}
                className="group bg-card rounded-xl p-5 shadow-xs card-hover border border-border/40 hover:border-primary/50 animate-[fade-in_0.5s_ease-out_forwards] opacity-0"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <ActiveIcon size={18} />
                    </span>
                    <h3 className="font-semibold text-[15px] leading-tight">
                      {skill.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 animate-[grow_1s_ease-out_forwards] origin-left"
                      style={{ width: skill.level + "%" }}
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground tabular-nums shrink-0">
                    {skill.level}%
                  </span>
                </div>
                <div className="mt-2 flex justify-end">
                  <span
                    className={cn(
                      "text-[11px] font-medium px-2 py-0.5 rounded-full",
                      skill.level >= 90 && "text-primary bg-primary/10",
                      skill.level >= 75 && skill.level < 90 && "text-foreground/70 bg-secondary",
                      skill.level < 75 && "text-muted-foreground bg-secondary/60"
                    )}
                  >
                    {getProficiency(skill.level)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};