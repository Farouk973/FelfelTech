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
        category: "3-Tier Discount Engine",
        items: [
          {
            title: "Discount Stacking (Coupons + Packs + Volume)",
            description: "The CreateOrderCommandHandler (446 lines) applies three discount layers in fixed priority: Pack > Volume > Coupon. Each line item resolves its unit price through pack proportional allocation or best-volume-tier lookup, then a coupon is applied to the subtotal. Fixed volume discounts split proportionally by line-item share.",
            tools: ["C#", ".NET 8", "MediatR", "MongoDB.Driver"],
            code: "var bestTier = discount.Tiers.OrderByDescending(t => t.MinQuantity).FirstOrDefault(t => totalQty >= t.MinQuantity); if (bestTier.DiscountType == \"percentage\") return Math.Round(product.Price * (1 - percent / 100), 2);",
          },
          {
            title: "Volume Discount Tier Picker UI",
            description: "The product detail component dynamically generates N variant picker slots matching the selected tier's minQuantity. Each slot has independent color/size dropdowns. A computed getter calculates the live discounted unit price per tier.",
            tools: ["Angular 15", "TypeScript", "Tailwind CSS"],
            code: "initSlotsForTier(index: number): void { const count = this.tiers[index]?.minQuantity || 1; this.variantSlots = []; for (let i = 0; i < count; i++) { this.variantSlots.push({ selectedColorId: ..., selectedSizeId: ... }); } }",
          },
          {
            title: "Coupon Validation & Date Windows",
            description: "Coupons are validated via a dedicated ValidateCouponQueryHandler that checks date windows using DiscountDateHelper.IsWithinWindow(), min order total, max uses limit, and active status. The frontend validates in-cart and shows the discount amount in real time.",
            tools: ["C#", "FluentValidation", "MediatR"],
            code: "public static bool IsWithinWindow(DateTime? startDate, DateTime? endDate, DateTime now) => (!startDate.HasValue || startDate.Value <= now) && (!endDate.HasValue || endDate.Value >= now);",
          },
          {
            title: "Pack Discount Proportional Distribution",
            description: "Pack discounts set a flat bundle price. The handler distributes this price proportionally across products based on their original unit-price share. Pack items are tagged with packId/packName in the cart; removing one pack item removes the entire pack.",
            tools: ["C#", ".NET 8", "MongoDB"],
          },
        ],
      },
      {
        category: "Order System",
        items: [
          {
            title: "Order State Machine with CAS Concurrency",
            description: "Order status follows a strict FSM defined as a static Dictionary<string, HashSet<string>>. Transitions use MongoDB's FindOneAndUpdateAsync with CAS (Compare-And-Swap) on the expected status to detect concurrent modifications. Invalid transitions throw BadRequestException.",
            tools: ["C#", ".NET 8", "MongoDB.Driver", "MediatR"],
            code: "private static readonly Dictionary<string, HashSet<string>> AllowedTransitions = new() { [\"Pending\"] = new() { \"Paid\", \"Shipped\", \"Cancelled\" }, [\"Paid\"] = new() { \"Shipped\", \"Cancelled\" }, [\"Shipped\"] = new() { \"Delivered\", \"Cancelled\" } };",
          },
          {
            title: "Manual Saga: Compensating Stock Transactions",
            description: "Order creation validates all stock atomically before any mutation. Each variant uses FindOneAndUpdateAsync with $inc for guarded decrement. If any later step fails, a compensation routine restores all stock and writes 'OrderFailed' StockMovement audit records.",
            tools: ["C#", ".NET 8", "MongoDB.Driver"],
            code: "try { await ApplyStockDecrementsAsync(...); } catch { await CompensateStockAsync(decremented, ...); throw; }",
          },
          {
            title: "Stock Restoration on Cancellation",
            description: "When an order is cancelled, the UpdateOrderCommandHandler iterates all order items, increments stock back via IncrementStockAsync, and writes a 'Return' StockMovement record for each variant.",
            tools: ["C#", ".NET 8", "MongoDB.Driver"],
          },
        ],
      },
      {
        category: "CQRS Architecture",
        items: [
          {
            title: "MediatR CQRS with 68 Handlers",
            description: "Every feature area (Auth, Products, Orders, Categories, Colors, Sizes, Users, Coupons, Inventory, Medias, PackDiscounts, VolumeDiscounts, StoreSettings, Analytics) has separate Command/Query classes implementing IRequest<T> and IRequestHandler<T,R>. Controllers inherit ApiControllerBase and call Mediator.Send().",
            tools: ["MediatR 11", "ASP.NET Core", "FluentValidation"],
            code: "public abstract class ApiControllerBase : ControllerBase { protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>(); }",
          },
          {
            title: "FluentValidation Pipeline Behavior",
            description: "A MediatR ValidationBehavior pipeline runs all FluentValidation validators before every handler. Failures are grouped into a ValidationException with an error dictionary, mapped to HTTP 400 by the exception middleware.",
            tools: ["FluentValidation", "MediatR 11", "ASP.NET Core"],
          },
          {
            title: "Generic Repository Pattern",
            description: "A MongoRepository<T> base provides paged queries (PagedResult<T> with TotalPages, HasPrevious/NextPage), CRUD operations, and aggregation. Feature-specific repositories extend it for domain queries.",
            tools: ["MongoDB.Driver", "C#", ".NET 8"],
          },
        ],
      },
      {
        category: "Authentication & Security",
        items: [
          {
            title: "JWT + Refresh Token Rotation",
            description: "AuthService generates HS256 JWTs with user ID, username, and role claims. Refresh tokens are 7-day opaque random bytes stored per-user. On refresh, the old token is revoked (ReplacedByToken chain) and a new one is issued. The Angular interceptor catches 401s, calls /auth/refresh with a single-in-flight flag to prevent refresh storms.",
            tools: ["System.IdentityModel.Tokens.Jwt", "BCrypt.Net", "Angular HttpClient"],
            code: "refreshToken.Revoked = DateTime.UtcNow; refreshToken.ReplacedByToken = newRefreshToken.Token; user.RefreshTokens.Add(newRefreshToken);",
          },
          {
            title: "Rate Limiting & Secret Enforcement",
            description: "AspNetCoreRateLimit limits login to 5 attempts per 15 seconds per IP. The API refuses to start if JWT_SECRET_KEY is missing or shorter than 32 characters — failing loudly in production rather than silently using a weak key.",
            tools: ["AspNetCoreRateLimit", "ASP.NET Core"],
          },
          {
            title: "BCrypt Password Hashing",
            description: "Passwords are hashed with BCrypt.Net-Next before storage. The admin user is auto-seeded on startup in the Development environment.",
            tools: ["BCrypt.Net-Next"],
          },
        ],
      },
      {
        category: "Frontend Storefront",
        items: [
          {
            title: "Color-to-Image Mapping",
            description: "A colorImageMap dictionary (colorId → imageUrl) is stored per product. Selecting a color calls applyColorImage() which looks up the mapped URL and sets it as selectedImage. The reverse lookup syncs the color picker when a thumbnail is clicked.",
            tools: ["Angular 15", "TypeScript"],
            code: "private applyColorImage(colorId: string): void { const img = this.product.colorImageMap?.[colorId]; if (img && this.product.images.includes(img)) this.selectedImage = img; }",
          },
          {
            title: "Image Lightbox with Keyboard Nav",
            description: "A custom lightbox (no external library) is implemented directly in the product detail component. It supports prev/next navigation, Escape to close, and ArrowLeft/ArrowRight keyboard shortcuts via a document keydown listener.",
            tools: ["Angular 15", "TypeScript"],
          },
          {
            title: "Auto-Play Hero Carousel with Swipe",
            description: "The homepage hero uses an auto-playing image carousel with pointer/touch swipe support. Touch events track deltaX for snap-to-slide behavior.",
            tools: ["Angular 15", "Tailwind CSS"],
          },
          {
            title: "Unsaved-Changes Guard",
            description: "All admin forms use a CanDeactivateFn route guard that JSON-stringifies the form snapshot on entry and compares on exit, prompting the user before leaving with unsaved changes.",
            tools: ["Angular 15", "TypeScript"],
          },
        ],
      },
      {
        category: "Admin Dashboard",
        items: [
          {
            title: "Chart.js Analytics (4 Charts)",
            description: "The dashboard renders a revenue line chart, order-status doughnut, category-revenue bar chart, and visitor line chart using ng2-charts (Chart.js wrapper). Data is fetched via MongoDB aggregation pipelines from the AnalyticsController.",
            tools: ["ng2-charts", "Chart.js", "Angular 15"],
            code: "revenueChartData: ChartData<'line'> = { labels: [], datasets: [] };",
          },
          {
            title: "Leaflet Visitor Map",
            description: "A Leaflet map centered on Tunis (36.8065, 10.1815) plots visitor cities with size-scaled divIcon markers. Marker size scales with visitor count (Math.min(20 + count * 4, 44)px). Tooltips show city, country, and visitor count.",
            tools: ["Leaflet", "OpenStreetMap", "Angular 15"],
            code: "const icon = L.divIcon({ html: `<div style=\"width: ${Math.min(20 + c.count * 4, 44)}px; height: ${Math.min(20 + c.count * 4, 44)}px;\">${c.count}</div>` });",
          },
          {
            title: "Live Online-Now Counter",
            description: "The dashboard polls /api/analytics/online-count every 30 seconds using RxJS interval(30000) piped through switchMap. The count updates a KPI card in real time.",
            tools: ["RxJS", "Angular 15", "ASP.NET Core"],
            code: "interval(30000).pipe(takeUntil(this.destroy$), switchMap(() => this.analyticsSvc.getOnlineCount())).subscribe(res => { this.data.onlineNow = res.count; });",
          },
        ],
      },
      {
        category: "Inventory Management",
        items: [
          {
            title: "Bulk Stock Adjustment with Rollback",
            description: "BulkAdjustStockCommandHandler processes all variants in a try/catch. If any adjustment fails, it rolls back every already-adjusted variant by inverting the quantity, then throws. Audit logs are only written after all mutations succeed.",
            tools: ["C#", ".NET 8", "MongoDB.Driver", "MediatR"],
            code: "catch { foreach (var entry in applied) { await _variantRepo.IncrementStockAsync(entry.VariantId, -entry.Quantity, ...); } throw; }",
          },
          {
            title: "Stock Movement Audit Trail",
            description: "Every stock change (Sale, Adjustment, Restock, Return, Damage) writes a StockMovement record with product name, type, quantity, previous/new stock, notes, and timestamp. Movements are filterable by type in the admin UI.",
            tools: ["C#", "MongoDB.Driver", "Angular 15"],
          },
          {
            title: "Low-Stock Alerts via Aggregation",
            description: "A MongoDB aggregation pipeline computes per-variant StockStatus (InStock/LowStock/OutOfStock) with a configurable threshold (default 5). Low-stock and out-of-stock counts surface on the admin dashboard.",
            tools: ["MongoDB.Driver", "ASP.NET Core"],
          },
        ],
      },
      {
        category: "Analytics & Geolocation",
        items: [
          {
            title: "Page-View Tracking with SHA-256 Sessions",
            description: "Every page load sends a fire-and-forget POST with sessionId, pageUrl, and productId. The backend derives the session ID by hashing IP+referrer+date with SHA256 and truncating to 16 hex chars. The frontend stores a crypto.randomUUID in localStorage.",
            tools: ["C#", "System.Security.Cryptography", "Angular 15"],
            code: "var raw = $\"{request.IpAddress}:{request.Referrer}:{DateTime.UtcNow:yyyyMMdd}\"; sessionId = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(raw)))[..16];",
          },
          {
            title: "IP Geolocation with Cache + Rate Limit",
            description: "GeolocationService resolves IPs via ip-api.com with a ConcurrentDictionary cache and a 40 req/min rate limit tracker. Localhost short-circuits to Tunisia defaults. Results are cached indefinitely in memory.",
            tools: ["C#", "System.Collections.Concurrent", "ip-api.com"],
            code: "private static readonly ConcurrentDictionary<string, GeoResult> _cache = new(); private static readonly ConcurrentDictionary<string, DateTime> _rateLimitTracker = new();",
          },
        ],
      },
      {
        category: "DevOps & Deployment",
        items: [
          {
            title: "GitHub Actions CI/CD Pipeline",
            description: "ci.yml runs dotnet restore/build/test on push to main/develop. deploy.yml uses appleboy/ssh-action to SSH into the VPS, git pull, run deploy-backend.sh (dotnet publish + systemctl restart), and deploy-frontend.sh (copy build to /var/www + nginx reload).",
            tools: ["GitHub Actions", "appleboy/ssh-action", "Nginx", "systemd"],
            code: "script: cd /home/deploy/repos/Tripfit && git pull origin main && bash /home/deploy/scripts/deploy-backend.sh",
          },
          {
            title: "One-Command VPS Provisioning",
            description: "setup-server.sh provisions a fresh Ubuntu 22.04 VPS: creates deploy user with passwordless sudo, installs .NET 8 runtime, Node.js 18, Nginx, Certbot for Let's Encrypt SSL, configures reverse proxy with security headers, creates systemd service, and sets up secrets.env (chmod 600).",
            tools: ["Bash", "Nginx", "Certbot", "systemd", "Ubuntu"],
          },
          {
            title: "Nginx Reverse Proxy with SSL",
            description: "Nginx handles HTTP→HTTPS redirect, SPA fallback routing, /api/ and /uploads/ proxying to Kestrel on port 5000, security headers (X-Frame-Options, HSTS, X-XSS-Protection), gzip compression, and 1-year static asset caching.",
            tools: ["Nginx", "Let's Encrypt", "Certbot"],
          },
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
          {
            title: "Dual-Mode Crawler (httpx + Scrapy)",
            description: "Each store is classified into 'direct' or 'scrapy' mode via static AST analysis of its spider source code (sources.py uses the ast module to detect start_requests overrides, Selenium usage, etc.). Direct mode uses httpx.AsyncClient with token-bucket rate limiting, wraps raw bytes into scrapy.http.TextResponse, and calls the same spider parse() method — no Scrapy reactor needed.",
            tools: ["Python", "httpx", "Scrapy", "curl_cffi", "asyncio"],
            code: "response = TextResponse(url=url, status=status, body=content, encoding='utf-8', request=request) await self._handle(response, spider, callback, to_fetch, seen)",
          },
          {
            title: "Cloudflare/WAF Bypass",
            description: "When httpx gets a 403, the direct crawler falls back to curl_cffi with Chrome TLS impersonation (impersonate='chrome'). This bypasses Cloudflare's bot detection by mimicking a real browser's TLS fingerprint.",
            tools: ["curl_cffi", "httpx", "Python"],
            code: "if exc.response is not None and exc.response.status_code == 403: content = await self._fetch_browser_like(url)  # curl_cffi fallback",
          },
          {
            title: "22 Tunisian Retailer Spiders",
            description: "Each spider implements parse() using Scrapy CSS selectors to extract title, prices, images, links, and category slugs. Spiders use BasePromoSpider helpers: _parse_price(), _discount_pct(), _category_from_url(), and per-store page budget limits.",
            tools: ["Scrapy", "Python", "CSS Selectors"],
            code: "def parse(self, response):\n  for card in response.css('article.product-miniature'):\n    item = PromotionItem()\n    item['title'] = card.css('h2.product-title a::text').get()",
          },
          {
            title: "Pipeline: Validate → Classify → Enrich → Batch",
            description: "Items flow through Scrapy pipelines that validate prices, run the ML classifier, enrich with brand/model, deduplicate, and batch (50 at a time) to the backend API with exponential-backoff and 429-cooldown handling.",
            tools: ["Scrapy", "Python", "ASP.NET Core"],
          },
        ],
      },
      {
        category: "ML Classifier",
        items: [
          {
            title: "Two-Layer Classification System",
            description: "Layer 1 is a deterministic rules engine (95%+ of cases) with 19 classification rules across 9 categories. Rules use pre-compiled single-pass regex patterns checked in priority order (Earphones > Consoles > Watches > Tablets > Laptops > TVs > etc.) with three independent veto layers. Layer 2 is an optional sentence-transformers embedding fallback for ambiguous items.",
            tools: ["sentence-transformers", "paraphrase-multilingual-MiniLM-L12-v2", "Python", "re"],
            code: "_EARPHONE_RE = _compile_keywords(EARPHONE_KEYWORDS) # compiled once at import\ndef _classify_rule_pass(title, description, category_hint):\n  norm_title = normalize(title)  # accent-stripped, lowercase",
          },
          {
            title: "Embedding Fallback with Cosine Similarity",
            description: "Items the rules can't decide are embedded using paraphrase-multilingual-MiniLM-L12-v2. Cosine similarity is computed against category prototype phrases (French, e.g. 'smartphone android samsung galaxy'). A junk-family veto drops anything where the best junk prototype is too close. Confidence threshold + margin gating prevent low-confidence assignments.",
            tools: ["sentence-transformers", "NumPy", "Python"],
            code: "vector = embedder.encode([text], normalize_embeddings=True)[0]\nscores = {cat: _cosine(vector, emb) for cat, emb in prototypes.items()}\nif junk_best >= best_score - EMBEDDING_MARGIN: return None",
          },
          {
            title: "260+ Labelled Regression Corpus",
            description: "A pytest regression gate uses 260+ labelled test cases to evaluate rules-only vs hybrid (rules + embedding) performance. This serves as ground truth for A/B evaluation and prevents regressions when rules are modified.",
            tools: ["pytest", "Python"],
          },
        ],
      },
      {
        category: "Backend API",
        items: [
          {
            title: "Cross-Store Product Aggregation",
            description: "ProductGrouper normalizes titles by removing diacritics, extracting brand/model (from classifier enrichment), and normalizing capacity ('128go' → '128GB'). Products with the same normalized key are grouped into one canonical Product with multi-store offers sorted by price. Each offer tracks IsRealDeal status.",
            tools: ["C#", "ASP.NET Core", "MongoDB.Driver"],
            code: "var key = RemoveDiacritics($\"{promotion.Brand} {promotion.Model}\".ToLowerInvariant());\nvar capacity = ExtractCapacity(promotion.Title);\nreturn $\"{Regex.Replace(key, \"[^a-z0-9]+\", \" \").Trim()} {capacity}\";",
          },
          {
            title: "Accent-Free Typo-Tolerant Search",
            description: "SearchFilterHelper.NormalizeText() strips diacritics using Unicode NFKD decomposition and lowercases. IsBrandMatch() uses Wagner-Fischer Levenshtein distance (distance ≤ 2, or ≤ 3 if first chars match) for typo-tolerant brand matching.",
            tools: ["C#", "MongoDB.Driver", "System.Text.RegularExpressions"],
            code: "var decomposed = input.Normalize(NormalizationForm.FormD);\nforeach (var ch in decomposed) { if (CharUnicodeInfo.GetUnicodeCategory(ch) == UnicodeCategory.NonSpacingMark) continue; }",
          },
          {
            title: "Genuine Deal Detection",
            description: "PriceHistoryHelper.IsRealDeal() compares the current price drop against the promotion's price history median. If the new price is above the median, the deal is flagged as non-genuine (inflated base price) and de-prioritized in discount and bon-plans feeds.",
            tools: ["C#", "ASP.NET Core"],
            code: "var med = Median(history.Select(h => h.Price));\nreturn newPrice <= med;  // must be at or below its own history median",
          },
          {
            title: "Bon-Plans Trending Drops Feed",
            description: "ScoreDeal() ranks promotions by discount percentage plus a freshness bonus: if the price dropped within the last 72h, the score gets a time-decayed boost proportional to the drop amount. Only genuine deals (IsRealDeal = true) qualify.",
            tools: ["C#", "ASP.NET Core"],
          },
          {
            title: "API Key Write Protection + Rate Limiting",
            description: "All mutating endpoints are guarded by ApiKeyMiddleware checking the X-Api-Key header. Only the scraper can write; reads stay public. Write rate limiting uses a per-IP token bucket separate from anonymous read limits.",
            tools: ["ASP.NET Core", "C#"],
          },
        ],
      },
      {
        category: "Angular SSR Frontend",
        items: [
          {
            title: "Server-Side Rendering with Cache",
            description: "server.ts uses Angular's CommonEngine to render pages on the server. An in-memory HTML cache (Map<string, {html, expiresAt, status}>) serves cached responses within TTL. AdSense script is injected server-side only when ADSENSE_PUBLISHER_ID is set.",
            tools: ["Angular 19", "@angular/ssr", "Express", "TypeScript"],
            code: "const commonEngine = new CommonEngine();\nconst htmlCache = new Map<string, { expiresAt: number; html: string; status: number }>();",
          },
          {
            title: "JSON-LD Structured Data",
            description: "Product detail pages inject schema.org Product JSON-LD with AggregateOffer (lowPrice, highPrice, offerCount) for Google rich results. The script tag is created once during SSR+hydration.",
            tools: ["Angular 19", "TypeScript", "schema.org"],
            code: "const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: product.title, offers: { '@type': 'AggregateOffer', lowPrice: range.min, highPrice: range.max } };",
          },
          {
            title: "SVG Price History Chart",
            description: "A pure SVG price-chart component uses Angular signals (computed()) to downsample price history, compute polyline coordinates, and render a gradient-filled area chart. No external charting library needed.",
            tools: ["Angular 19", "SVG", "TypeScript"],
            code: "readonly linePath = computed(() => this.coords().map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));",
          },
          {
            title: "Dynamic Sitemap + robots.txt",
            description: "Express endpoints generate /sitemap.xml (static paths + paginated product URLs) and /robots.txt server-side. Product URLs are fetched from the API at request time.",
            tools: ["Express", "Angular SSR", "TypeScript"],
          },
          {
            title: "SEO Service with Canonical URLs",
            description: "SeoService subscribes to NavigationEnd events, extracts the current URL, and updates canonical, og:url, title, and meta description via @angular/platform-browser's Meta and Title services.",
            tools: ["Angular 19", "@angular/platform-browser", "RxJS"],
          },
        ],
      },
      {
        category: "Flutter Mobile App",
        items: [
          {
            title: "Privacy-First Barcode Scanner",
            description: "Camera only starts on explicit user tap (never at startup) and is fully disposed when the Scan tab goes inactive. Detected EANs look up products via the barcode API and deep-link into detail. Duplicate detections within the same session are deduped.",
            tools: ["Flutter", "mobile_scanner", "Dart"],
            code: "void _startCamera() { final controller = MobileScannerController(); _controller = controller; _started = true; }",
          },
          {
            title: "Riverpod Family Providers",
            description: "ProductsListNotifier extends FamilyAsyncNotifier<PagedResult, int> where the family parameter is the page number. Every filter (search, category, store, sort, price range) is a separate StateProvider. Changing any filter automatically rebuilds all pages via Riverpod's dependency graph.",
            tools: ["flutter_riverpod", "Dart", "Flutter"],
            code: "final productsListProvider = AsyncNotifierProvider.family<ProductsListNotifier, PagedResult<ProductSummary>, int>(ProductsListNotifier.new);",
          },
          {
            title: "Infinite-Scroll with Filter Drawer",
            description: "The product list uses a filter drawer (ChoiceChip for categories/stores, RangeSlider for price) and infinite-scroll pagination. The filter drawer writes to Riverpod providers and invalidates the list, triggering a fresh page-1 fetch.",
            tools: ["Flutter", "Dart", "flutter_riverpod"],
          },
          {
            title: "AdMob Integration (Compile-Time Gated)",
            description: "Banner, interstitial (every N navigations), and native ads are all gated behind ADS_ENABLED compile-time flag. Ad IDs are configured in app_config.dart. InterstitialAd.load() is called on a navigation counter modulo check.",
            tools: ["google_mobile_ads", "Flutter", "Dart"],
            code: "if (navigationCount % everyN != 0) return;\nawait InterstitialAd.load(adUnitId: kAdMobInterstitialId, ...);",
          },
        ],
      },
      {
        category: "Data Quality & Infrastructure",
        items: [
          {
            title: "Price History Snapshots (Capped at 90)",
            description: "Append() maintains a monotonic-timestamp list of price snapshots per promotion. When the list exceeds 90 entries, the oldest are trimmed. This bounds memory while preserving enough history for genuine-deal detection and the SVG price chart.",
            tools: ["C#", "MongoDB.Driver"],
            code: "if (list.Count > MaxHistory) list.RemoveRange(0, list.Count - MaxHistory);",
          },
          {
            title: "MongoDB Distributed Lock",
            description: "MongoDistributedLock uses a single BsonDocument per key with atomic FindOneAndUpdateAsync (CAS) to acquire. TTL-based lease expiry prevents deadlocks from crashed holders. The lock is reentrant (same owner can re-acquire) and uses IDisposable for RAII-style release.",
            tools: ["MongoDB.Driver", "C#", "System.Threading"],
            code: "var before = await _locks.FindOneAndUpdateAsync(filter, update, ...);\nif (before is not null) return new LockHandle(this, key, owner); // acquired",
          },
          {
            title: "Atomic Catalog Rebuild (Collection Swap)",
            description: "ProductService.RebuildAsync() groups promotions into canonical products, then swaps in a staging MongoDB collection and renames it atomically. Readers never see a half-built catalog. A 30-second cooldown prevents rapid rebuilds.",
            tools: ["MongoDB.Driver", "C#", "ASP.NET Core"],
          },
          {
            title: "Expired Promotion Cleanup",
            description: "A background ExpiredPromotionCleanupService periodically removes promotions past their end date, keeping the database clean and ensuring only active deals appear in feeds.",
            tools: ["ASP.NET Core", "C#", "MongoDB.Driver"],
          },
        ],
      },
      {
        category: "DevOps & Automation",
        items: [
          {
            title: "FastAPI Control Plane",
            description: "A FastAPI app provides GET /health, GET /spiders, POST /crawl/* endpoints, and an automatic crawl loop (AUTO_CRAWL_INTERVAL_MINUTES). The crawl dispatcher routes to DirectCrawler or Scrapy subprocess based on AST analysis. Crawl records track task IDs, progress, and observability metrics.",
            tools: ["FastAPI", "Python", "uvicorn"],
            code: "@app.post('/crawl/all')\nasync def trigger_crawl_all():\n  task_ids = await _crawl_all_now()\n  return {'status': 'started', 'spiders': available, 'task_ids': task_ids}",
          },
          {
            title: "Per-Spider Process Isolation",
            description: "crawl_all.py runs each spider in its own thread with a per-spider timeout. If a spider hangs, only that spider is affected. The script exits non-zero on any failure so GitHub Actions marks the cron as failed. Progress is visualized via ANSI console bars.",
            tools: ["Python", "threading", "GitHub Actions"],
            code: "worker = threading.Thread(target=_run, name=f'crawl-{spider}')\nworker.start()\nworker.join(timeout=timeout)\nif worker.is_alive(): return f'timed out after {timeout:.0f}s'",
          },
          {
            title: "Daily Automated Crawls (Cron)",
            description: "GitHub Actions cron triggers scraper-cron.yml at 03:00 UTC daily. The workflow runs crawl_all.py, which iterates all 22 spiders with per-spider timeouts and reports failures. Non-zero exit triggers a GitHub Actions failure notification.",
            tools: ["GitHub Actions", "Python", "Scrapy"],
          },
          {
            title: "429-Backoff with Global Cooldown",
            description: "When the backend returns 429 (rate limited), the pipeline enters a global cooldown period where all spiders pause. Exponential backoff with jitter is applied per-request. A wait-for-backend-ready handshake resumes crawling after cooldown.",
            tools: ["Python", "Scrapy", "asyncio"],
          },
        ],
      },
      {
        category: "Monetization",
        items: [
          {
            title: "AdSense (SSR-Injected)",
            description: "The AdSense script tag is injected server-side into </head> during SSR only when ADSENSE_PUBLISHER_ID env var is set. AdCard components render ad slots from ads.config.ts. Click tracking uses navigator.sendBeacon() to fire-and-forget to /api/analytics/ad-click.",
            tools: ["Google AdSense", "Express", "Angular 19", "sendBeacon API"],
            code: "navigator.sendBeacon('/api/analytics/ad-click', new Blob([data], { type: 'application/json' }));",
          },
          {
            title: "AdMob (Flutter Mobile)",
            description: "Banner, interstitial, and native ad variants are configured in app_config.dart behind ADS_ENABLED. Interstitials show every N navigations. All ad IDs are runtime-configurable.",
            tools: ["google_mobile_ads", "Flutter"],
          },
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