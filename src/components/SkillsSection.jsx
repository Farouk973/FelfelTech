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

const categories = ["frontend", "backend", "databases", "tools"];

export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("frontend");

  const filteredSkills = skills
  .filter( (skill) => skill.category === activeCategory )
  .sort((a, b) => b.level - a.level);

  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-forefround hover:bd-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="bg-card p-6 rounded-lg shadow-xs card-hover"
            >
              <div className="text-left mb-4">
                <h3 className="font-semibold text-lg">{skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full origin-left animate-[grow_1.5s_ease-out]"
                  style={{ width: skill.level + "%" }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-sm text-muted-foreground">
                  {skill.level}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
