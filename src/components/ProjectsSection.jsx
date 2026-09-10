import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  MousePointerClick,
} from "lucide-react";
import { useRef, useState } from "react";
import { ProjectModal } from "./ProjectModal";

const projects = [
  {
    id: 5,
    title: "Mar1One — E-Commerce Platform",
    description:
      "Full-stack clothing e-commerce with Clean Architecture, CQRS/MediatR, MongoDB, a 3-tier discount engine, order state machine, and a full admin dashboard — deployed to production via CI/CD.",
    image: "/projects/mar1one.svg",
    tags: [
      ".NET 8",
      "Angular 15",
      "MongoDB",
      "MediatR",
      "CQRS",
      "Clean Architecture",
      "JWT",
      "Tailwind CSS",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/Farouk973",
    detailedDescription:
      "Mar1One (originally TripFit) is a full-stack e-commerce platform built for a real client — a clothing shop. The backend follows strict Clean Architecture (Domain → Application → Infrastructure → API) with CQRS via MediatR, persisted in MongoDB with a generic repository pattern. The frontend is an Angular 15 standalone SPA with a public storefront and a full admin CMS, styled entirely with Tailwind CSS. Features include a 3-tier discount/pricing engine (coupons, pack bundles, volume tiers), an order state machine with compensating stock transactions, JWT + refresh token auth, a dashboard with live analytics and a Leaflet visitor map, and a full CI/CD pipeline deployed to a VPS with nginx.",
    techStack: [
      ".NET 8",
      "C#",
      "MediatR 11",
      "FluentValidation",
      "AutoMapper",
      "MongoDB Driver 3.9",
      "Angular 15 (Standalone)",
      "TypeScript",
      "Tailwind CSS",
      "Chart.js",
      "Leaflet",
      "BCrypt",
      "JWT + Refresh Tokens",
      "Nginx",
      "GitHub Actions",
      "systemd",
    ],
    sections: [
      {
        title: "Architecture & Design Patterns",
        items: [
          "Clean Architecture (Onion) with 4 strict layers: Domain → Application → Infrastructure → API — zero upward dependencies",
          "CQRS via MediatR 11 with 68 IRequestHandler implementations across 14 feature areas (Auth, Products, Orders, Categories, Colors, Sizes, Users, Coupons, Inventory, Medias, PackDiscounts, VolumeDiscounts, StoreSettings, Analytics)",
          "MediatR ValidationBehavior pipeline — FluentValidation validators run before every handler; failures throw grouped ValidationException",
          "Generic MongoRepository<T> base with paged queries (PagedResult<T> with TotalPages, HasPrevious/NextPage)",
          "Custom exception middleware mapping domain exceptions to HTTP codes: NotFoundException → 404, ConflictException → 409, ValidationException → 400 with error dictionary",
          "Thin controllers inheriting ApiControllerBase — all logic lives in CQRS handlers",
        ],
      },
      {
        title: "Backend — The Hard Parts",
        paragraphs: [
          "The pricing engine in CreateOrderCommandHandler (446 lines) is the most complex piece. It stacks 3 discount systems: Coupons (percentage or fixed against subtotal, validated with date windows, min order, max uses), Pack Discounts (fixed bundle price proportionally distributed by unit-price share across products), and Volume Discounts (best-tier by total quantity — percentage rolls into unit price, fixed splits proportionally).",
          "Order creation validates all stock atomically before any mutation. Each variant uses MongoDB's FindOneAndUpdateAsync with $inc for guarded decrement (fails if insufficient stock unless ContinueSellingWhenOutOfStock). If any later step fails, a compensation routine restores all stock and writes 'OrderFailed' StockMovement audit records — a manual saga pattern.",
          "Order status follows a strict state machine: Pending → {Paid, Shipped, Cancelled}, Paid → {Shipped, Cancelled}, Shipped → {Delivered, Cancelled}, with terminal states. Status transitions use CAS (Compare-And-Swap) on the expected status to detect concurrent modifications. Cancelling restores stock and logs Return movements.",
          "File upload supports up to 20 files (10 MB each, 50 MB request cap) with SHA-256 content deduplication — duplicate files are detected and returned separately. Inventory management includes bulk adjust (all-or-nothing with rollback), stock movement audit trail, and MongoDB aggregation pipelines for low-stock queries with computed StockStatus.",
        ],
      },
      {
        title: "Authentication & Security",
        items: [
          "JWT Bearer auth with HS256, role-based authorization (Admin/User), refresh token rotation (7-day opaque tokens, old token revoked + replaced)",
          "Rate limiting via AspNetCoreRateLimit — 5 login attempts per 15 seconds per IP",
          "App refuses to start if JWT secret key is missing or < 32 chars — fails loudly in production",
          "Forwarded Headers middleware for correct client IP behind nginx reverse proxy",
          "CORS policy locked to Angular origin (localhost:4200 in dev, configurable in prod)",
          "Password hashing with BCrypt, admin user seeded on startup in Development",
        ],
      },
      {
        title: "Frontend — Angular 15 Standalone SPA",
        paragraphs: [
          "100% standalone components — zero NgModules. Functional interceptors (HttpInterceptorFn) and functional guards (CanActivateFn, CanDeactivateFn). Auth interceptor handles automatic JWT refresh on 401 with single-in-flight flag to prevent refresh storms.",
          "Public storefront: hero carousel with touch/pointer swipe, rotating multi-language announcement bar (FR/AR/EN), client-side search popup, product detail page with color→image mapping, volume discount tier picker with per-slot variant selection, live countdown timers for scheduled discounts, skeleton loading, and a cart with volume-discount grouping, server-validated coupons, and max-delivery-fee shipping.",
          "Admin CMS: dashboard with KPI cards, live 'Online Now' (polled every 30s), 4 Chart.js charts (revenue line, order-status doughnut, category-revenue bar, visitor line), Leaflet world map with size-scaled city markers, top-selling/most-clicked lists. Product form with drag-to-reorder chips, on-the-fly color creation with hex picker, media library picker, variant stock matrix editor, and 6-digit SKU validation.",
          "Unsaved-changes guard on all forms using JSON-stringified form snapshots. Toast notification system (4 types, slide-in) and reusable confirmation dialog for destructive actions.",
        ],
      },
      {
        title: "Analytics & Geolocation",
        items: [
          "Anonymous page-view tracking with session IDs derived from SHA-256(IP:referrer:date)",
          "Geolocation via ip-api.com with in-memory cache + 40 req/min rate limit; localhost short-circuits to Tunisia default",
          "Dashboard aggregates: revenue/orders/visitors/online-now/top-selling/top-clicked/revenue-by-category via MongoDB aggregation pipelines",
          "Visitor cities plotted on a Leaflet map with size-scaled markers in the admin dashboard",
          "Excludes Cancelled orders from all analytics calculations",
        ],
      },
      {
        title: "DevOps & Deployment",
        items: [
          "GitHub Actions CI/CD: build + test on push to main/develop; SSH deploy to VPS on main merge",
          "Nginx reverse proxy: HTTP→HTTPS (Let's Encrypt), SPA routing, /api/ and /uploads/ proxied to .NET Kestrel on port 5000, security headers, gzip, static asset caching",
          "systemd service with secrets loaded from a chmod 600 env file — never committed to git",
          "Server provisioning script (setup-server.sh) for fresh VPS: firewall, .NET 8 runtime, Node 18, nginx, certbot, systemd, secrets template",
          "MongoMigration console tool for local→MongoDB Atlas data migration with batched inserts and index cloning",
        ],
      },
    ],
    features: [
      {
        category: "Storefront",
        items: [
          "Hero carousel with touch/pointer swipe and auto-play",
          "Multi-language rotating announcement bar (FR/AR/EN)",
          "Client-side search popup with real-time results",
          "Product detail page with color-to-image mapping",
          "Volume discount tier picker with per-slot variant selection",
          "Live countdown timers for scheduled discounts",
          "Cart with volume-discount grouping and server-validated coupons",
          "Max-delivery-fee shipping calculation",
          "Skeleton loading states across all pages",
        ],
      },
      {
        category: "Admin Dashboard",
        items: [
          "KPI cards: revenue, orders, visitors, online now",
          "4 Chart.js charts: revenue line, order-status doughnut, category-revenue bar, visitor line",
          "Leaflet world map with size-scaled city markers",
          "Top-selling and most-clicked product lists",
          "Live 'Online Now' counter polled every 30s",
          "Low stock alerts with configurable threshold",
        ],
      },
      {
        category: "Product Management",
        items: [
          "Drag-to-reorder chips for images, colors, and sizes",
          "On-the-fly color creation with hex color picker",
          "Media library picker with multi-file upload",
          "Variant stock matrix editor (color x size grid)",
          "6-digit SKU validation per product",
          "Color-image mapping for gallery switching",
          "Category multi-select with slug-based routing",
        ],
      },
      {
        category: "3-Tier Discount Engine",
        items: [
          "Coupons: percentage or fixed discount with date windows, min order total, and max uses",
          "Pack Discounts: fixed bundle price proportionally distributed by unit-price share across products",
          "Volume Discounts: best-tier pricing by total quantity, percentage rolls into unit price",
          "Scheduled start/end dates for all discount types",
          "Active/inactive toggle without deletion",
          "Frontend countdown timer and tier selector UI",
        ],
      },
      {
        category: "Order System",
        items: [
          "Strict state machine: Pending → Paid → Shipped → Delivered with Cancelled from any non-terminal state",
          "Compensating stock transactions (manual saga pattern) on order failure",
          "CAS-based concurrent status updates to detect race conditions",
          "Stock restoration and audit logging on cancellation",
          "Public checkout without login required",
          "Tunisian city selection (24 governorates)",
        ],
      },
      {
        category: "Authentication & Security",
        items: [
          "JWT Bearer auth with HS256 and refresh token rotation",
          "Rate limiting: 5 login attempts per 15 seconds per IP",
          "BCrypt password hashing",
          "Role-based authorization (Admin/User)",
          "JWT secret key enforcement (refuses to start if missing or < 32 chars)",
          "CORS locked to Angular origin",
        ],
      },
      {
        category: "Inventory Management",
        items: [
          "Single and bulk stock adjustment with rollback",
          "Stock movement audit trail (Sale, Adjustment, Restock, Return, Damage)",
          "Low-stock alerts via MongoDB aggregation pipelines",
          "Variant-level stock tracking with computed StockStatus",
          "Filter by stock status: InStock, LowStock, OutOfStock",
        ],
      },
      {
        category: "Analytics & Geolocation",
        items: [
          "Anonymous page-view tracking with SHA-256 session IDs",
          "Geolocation via ip-api.com with in-memory cache",
          "Visitor cities plotted on Leaflet map in admin dashboard",
          "Revenue, orders, visitors, top-selling, top-clicked aggregations",
          "Cancelled orders excluded from all analytics",
        ],
      },
      {
        category: "DevOps & Deployment",
        items: [
          "GitHub Actions CI/CD: build + test on push, SSH deploy on main merge",
          "Nginx reverse proxy with Let's Encrypt SSL",
          "systemd service with secrets from chmod 600 env file",
          "One-command VPS provisioning script (setup-server.sh)",
          "MongoMigration console tool for Atlas data migration",
          "Security headers, gzip compression, static asset caching",
        ],
      },
    ],
    links: ["GitHub", "View Repository"],
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
    features: [
      {
        category: "Scraper Engine",
        items: [
          "22 Tunisian retailer spiders (Tunisianet, Mytek, Spacenet, Electronics.tn, etc.)",
          "Dual-mode crawling: direct httpx for simple stores, Scrapy subprocess for complex ones",
          "Automatic crawl mode selection via static AST analysis of spider source code",
          "Cloudflare/WAF bypass using curl_cffi with Chrome TLS impersonation",
          "Token-bucket rate limiting with concurrency caps and per-batch timeouts",
          "Pipeline: price validation, classification, brand/model enrichment, deduplication, batch upsert",
        ],
      },
      {
        category: "ML Classifier",
        items: [
          "Layer 1: Deterministic rules engine (95%+ of cases) with 19 classification rules across 9 categories",
          "Three independent veto layers to prevent common misclassifications",
          "Layer 2: Embedding fallback using paraphrase-multilingual-MiniLM-L12-v2 via sentence-transformers",
          "Cosine similarity with confidence threshold and margin gating",
          "Junk-family veto for printers, appliances, audio, etc.",
          "260+ labelled regression corpus for A/B evaluation",
        ],
      },
      {
        category: "Backend API",
        items: [
          "ASP.NET Core 8 REST API with MongoDB persistence",
          "Promotion ingestion with API key write protection and rate limiting",
          "Product aggregation: title normalization, stop-word removal, capacity normalization",
          "Accent-free search with MongoDB text search",
          "Typo-tolerant brand matching via Levenshtein distance",
          "Genuine deal detection comparing against price median to flag inflated base prices",
          "Bon-plans feed: trending drops from last 72h ranked by relevance score",
          "Background expired-promotion cleanup service",
        ],
      },
      {
        category: "Angular SSR Frontend",
        items: [
          "Angular 19 with full server-side rendering for SEO",
          "Product grid with search, category/sub-category/store filters, sorting, pagination",
          "Product detail page comparing all offers across stores with SVG price chart",
          "JSON-LD structured data on product pages",
          "Server-rendered true 404 pages with proper HTTP status codes",
          "Category landing pages for 9 canonical categories with SEO content",
          "7 buying guide editorial pages for informational search ranking",
          "Multi-language rotating announcement banner (EN/FR/AR)",
        ],
      },
      {
        category: "Mobile App (Flutter)",
        items: [
          "Cross-platform Android/iOS app with Riverpod state management",
          "Product browsing with infinite-scroll pagination",
          "Filter drawer with category, sub-category, store, sort, price range",
          "Grid/list view toggle with 1/2-column options",
          "Barcode scanner: camera only starts on explicit user action, disposed when inactive",
          "Favorites backed by SharedPreferences with optimistic hearts",
          "AdMob banner, interstitial, and native ads (compile-time gated)",
        ],
      },
      {
        category: "Data Quality & Infrastructure",
        items: [
          "Cross-store product catalog rebuilding after each crawl",
          "Price history snapshots per promotion (capped at 90)",
          "CategoryMapper: free-form scraped categories mapped to canonical ones",
          "File-based live progress visualization across concurrent crawls",
          "MongoDB distributed lock for atomic catalog rebuilds (staging swap)",
          "Response compression (Brotli/Gzip) and memory caching of facet data",
        ],
      },
      {
        category: "DevOps & Automation",
        items: [
          "Daily automated crawls via GitHub Actions cron at 03:00 UTC",
          "Per-store health reports: pages crawled, items scraped, failures, HTTP codes",
          "crawl_all.py: per-spiders process isolation with timeout and non-zero exit on failure",
          "429-backoff with global cooldown and wait-for-backend-ready handshake",
          "FastAPI control plane with crawl endpoints and automatic crawl loop",
        ],
      },
    ],
    links: ["Live Site", "GitHub"],
  },
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
];

export const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const scrollRef = useRef(null);

  const scrollBy = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          {" "}
          Featured <span className="text-primary"> Projects </span>
        </h2>

        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Here are some of my recent projects. Each project was carefully
          crafted with attention to detail, performance, and user experience.
          Click on a card to see the details.
        </p>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
          >
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover cursor-pointer relative border border-border/40 hover:border-primary/50 transition-all duration-300 snap-start w-[300px] sm:w-[340px] shrink-0"
              >
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
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

          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 items-center justify-center h-10 w-10 rounded-full bg-card border border-border shadow-lg hover:bg-secondary/60 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 items-center justify-center h-10 w-10 rounded-full bg-card border border-border shadow-lg hover:bg-secondary/60 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
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