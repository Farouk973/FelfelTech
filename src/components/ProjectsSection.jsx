import { ArrowRight, ExternalLink, Github, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { ProjectModal } from "./ProjectModal";

const projects = [
  {
    id: 1,
    title: ".Net clean architecture ToDoApp",
    description: "A robust .Net application following clean architecture principles, featuring JWT authentication and CQRS. read readme in github",
    image: "/projects/clean.jpg",
    tags: [".Net", "c#", "Jwt", "Clean Architecture", "MediatR", "CQRS", "Entity Framework"],
    demoUrl: "https://github.com/Farouk973/BaseApp.git",
    githubUrl: "https://github.com/Farouk973/BaseApp.git",
    detailedDescription:
      "A robust .Net application built following Clean Architecture principles. Features JWT authentication for secure access and CQRS pattern using MediatR for clean separation of commands and queries. Implemented with Entity Framework for data persistence.",
    techStack: [".Net", "C#", "JWT", "Clean Architecture", "MediatR", "CQRS", "Entity Framework", "SQL Server"],
    sections: [
      {
        title: "Architecture",
        items: [
          "Clean Architecture layering: Domain, Application, Infrastructure, and Presentation",
          "CQRS pattern with MediatR for command/query separation",
          "JWT-based authentication with refresh tokens",
          "Entity Framework for ORM and data access",
          "Dependency injection for loose coupling and testability",
        ],
      },
    ],
    links: ["View Code", "View Repository"],
  },
  {
    id: 2,
    title: "Orbit Analytics Dashboard",
    description:
      "Interactive analytics dashboard with data visualization and filtering capabilities.",
    image: "/projects/project2.png",
    tags: ["TypeScript", "D3.js", "Next.js"],
    demoUrl: "#",
    githubUrl: "#",
    detailedDescription:
      "An interactive analytics dashboard with data visualization and filtering capabilities.",
    techStack: ["TypeScript", "D3.js", "Next.js"],
    sections: [
      {
        title: "Features",
        items: [
          "Interactive data visualizations",
          "Advanced filtering and search",
        ],
      },
    ],
    links: ["Live Demo", "GitHub"],
  },
  {
    id: 3,
    title: "E-commerce Platform",
    description:
      "Full-featured e-commerce platform with user authentication and payment processing.",
    image: "/projects/project3.png",
    tags: ["React", "Node.js", "Stripe"],
    demoUrl: "#",
    githubUrl: "#",
    detailedDescription:
      "A full-featured e-commerce platform with user authentication and payment processing.",
    techStack: ["React", "Node.js", "Stripe"],
    sections: [
      {
        title: "Features",
        items: [
          "User authentication and authorization",
          "Stripe payment processing",
          "Product catalog and cart management",
        ],
      },
    ],
    links: ["Live Demo", "GitHub"],
  },
  {
    id: 4,
    title: "Promo Tunisie",
    description:
      "Full-stack price comparison and deals aggregator scraping 18+ Tunisian e-commerce stores with a smart two-layer ML classifier.",
    image: "/projects/promo.svg",
    tags: ["Angular", "Flutter", ".NET", "Scrapy", "MongoDB", "Machine Learning", "FastAPI", "Python"],
    demoUrl: "https://promotunisie.com",
    githubUrl: "https://github.com/Farouk973",
    detailedDescription:
      "Promo Tunisie is a full-stack price comparison and deals aggregator that automatically scrapes promotions from 18+ Tunisian e-commerce stores, classifies products into whitelisted categories using a two-layer machine learning classifier, stores them in MongoDB, and serves them through a REST API, an Angular SSR web frontend, and a Flutter mobile app.",
    techStack: [
      "Python", "Scrapy", "FastAPI", "httpx", "curl_cffi", "sentence-transformers",
      "ASP.NET Core", "MongoDB", "Angular 19", "Flutter", "Docker", "GitHub Actions"
    ],
    sections: [
      {
        title: "Architecture",
        items: [
          "Scraper (Python) — Scrapy spiders + FastAPI control plane for crawling 18+ stores",
          "Backend API (ASP.NET Core) — REST API with MongoDB persistence",
          "Web Frontend (Angular 19 SSR) — server-side rendered product search & detail pages",
          "Mobile App (Flutter) — cross-platform app with favorites, filters & barcode scanner",
          "Deployed on Render.com with GitHub Actions daily cron jobs",
        ],
      },
      {
        title: "How the Scraper Works",
        paragraphs: [
          "Each store is automatically classified into one of two crawl modes via static AST analysis of its spider source code. Simple predictable stores run in direct mode using httpx for async fetching at ~3 requests/sec with token-bucket rate limiting, finishing 1000+ items in 30-40 seconds. Complex stores fall back to running the full Scrapy engine as a subprocess.",
          "Spider parse() methods extract product title, prices, images, links, and category slugs. A Cloudflare/WAF bypass uses curl_cffi with Chrome TLS impersonation when plain httpx gets a 403. Items flow through a pipeline that validates prices, classifies products, enriches with brand/model, deduplicates, and batches them (50 at a time) to the backend API with exponential-backoff fallbacks.",
        ],
      },
      {
        title: "How the Classifier Works",
        paragraphs: [
          "The classifier uses a two-layer approach. Layer 1 is a deterministic rules engine (95%+ of cases) that runs a carefully ordered sequence of checks: accessory vetoes, TV-brand model signatures, phone bundle detection, and 19 distinct classification rules across 9 whitelisted categories (Phones, Computers, Tablets, Earphones, Watches, TVs, Desktops, Mouse & Keyboards, Consoles). Three independent veto layers prevent the most common misclassifications.",
          "Layer 2 is an optional embedding fallback using paraphrase-multilingual-MiniLM-L12-v2 via sentence-transformers. Items the rules could not decide are embedded and compared against category prototype phrases with cosine similarity, gated by a confidence threshold and margin. A junk-family veto (printers, appliances, audio, etc.) drops anything ambiguous. The rules layer cannot be overridden by embeddings.",
          "A 260+ case labelled corpus serves as the pytest regression gate and ground truth for A/B evaluation of rules-only vs hybrid performance. Model names are normalized (e.g. 'redmi 13c' → 'Redmi 13C') to enable cross-store product grouping.",
        ],
      },
      {
        title: "Notable Features",
        items: [
          "Barcode (EAN/GTIN) extraction from JSON-LD for product matching",
          "Per-category price floors to drop misparsed prices (e.g. < 20 TND for phones)",
          "Cross-store product catalog rebuilding after each crawl",
          "Automatic expired-promotion cleanup in the background",
          "File-based live progress visualization across concurrent crawls",
          "Daily automated crawls via GitHub Actions cron at 03:00 UTC",
        ],
      },
    ],
    links: ["Live Site", "GitHub"],
  },
];

export const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
          Click on a card to see the details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover cursor-pointer relative"
            >
              <div className={`overflow-hidden ${project.image.endsWith('.svg') ? 'aspect-video bg-secondary/40' : 'h-48'}`}>
                <img
                  src={project.image}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${project.image.endsWith('.svg') ? 'object-contain' : ''}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/projects/project1.png";
                  }}
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-1"> {project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Github size={20} />
                    </a>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-foreground/50 group-hover:text-primary transition-colors">
                    <MousePointerClick size={12} /> Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            href="https://github.com/Farouk973"
          >
            Check My Github <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};
