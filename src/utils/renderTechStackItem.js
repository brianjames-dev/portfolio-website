// /utils/renderTechStackItem.js
import iconMap from "../data/iconMap";

const projectPurposeMap = {
  bookiebot: {
    Python:
      "Core orchestration layer for expense intents, embeds, and automation.",
    "Discord.py":
      "Real-time command + slash interface that powers the chat UX.",
    Git: "Keeps autonomous-agent workstreams versioned and releasable.",
    "OpenAI API": "LLM classification, summarization, and intent routing.",
    "Google Sheets API":
      "Ledger storage plus analytics source-of-truth for expenses.",
    Railway: "Always-on hosting and background job scheduler for the bot.",
  },
  snoozeai: {
    Swift:
      "Native iOS client, Notification Service Extension, and Focus-aware UI.",
    Python:
      "Backend workers for classification, summarization, and scheduling.",
    FastAPI:
      "Low-latency API surface that brokers device ↔ cloud communication.",
    "OpenAI API":
      "Urgency classifier and one-line summaries for notification bodies.",
    Firebase: "Auth + device sync, including token exchange for secure pushes.",
    Firestore: "Stores user rules, digests, VIP lists, and delivery history.",
    GCP: "Serverless execution for rule engines and fan-out jobs.",
    "APNs / FCM":
      "Push transport that actually delivers/bypasses notifications.",
    SQLite: "On-device cache to apply rules offline and reduce round trips.",
    Docker: "Containerizes FastAPI + worker images for CI/CD and Cloud Run.",
    Xcode:
      "Primary IDE/test harness for iOS builds and notification extensions.",
  },
  marketscope: {
    TypeScript: "Typed React + pipeline scripts with safer refactors.",
    React: "Interactive dashboards, lead tables, and report exports.",
    Python: "Data ingestion, enrichment, and scoring pipelines.",
    FastAPI: "API for orchestrating crawlers, scoring jobs, and exports.",
    PostgreSQL: "Primary store for advertiser profiles, keywords, and scores.",
    Redis: "Caching SERP snapshots and rate-limited job queues.",
    Docker: "Ships crawlers + workers as reproducible containers.",
    GCP: "Cloud Run/Cloud Tasks backbone for the data pipeline.",
    SerpAPI: "SERP capture to discover advertisers per keyword/geo.",
    "Google Ads": "Keyword economics, schedules, and creative metadata.",
    Pandas: "In-memory blending of metrics and outreach briefs.",
    Playwright: "Headless site audits for landing-page quality signals.",
  },
  portfolio: {
    React: "Front-end framework for the interactive portfolio UI.",
    JavaScript: "Client logic, animations, and custom hooks.",
    HTML: "Semantic layout and accessible structure.",
    CSS: "Theming, responsive grid, and motion styling.",
    Git: "Version control + deployment history.",
    AWS: "Cloud foundation that ties the serverless pieces together.",
    "AWS Lambda": "Processes contact-form submissions safely.",
    S3: "Static asset + build artifact hosting.",
    CloudFront: "Global CDN for low-latency page loads.",
    SES: "Email delivery for the contact workflow.",
  },
  "task-checklist": {
    React: "Reusable list components and UI state management.",
    JavaScript: "Client-side form validation and interactions.",
    "Node.js": "Runtime for the backend API.",
    "Express.js": "REST endpoints handling CRUD operations.",
    MongoDB: "Document store for tasks and user data.",
    HTML: "Base markup for the SPA shell.",
    CSS: "Custom styling for modals, cards, and layout.",
  },
  "nes-emulator": {
    "C++": "Cycle-accurate CPU/APU emulation core.",
    Git: "Team collaboration + regression control.",
    SDL2: "Cross-platform audio/video output.",
    "Dear ImGUI": "Debugging overlays and tooling UI.",
  },
};

const DEFAULT_PURPOSE = "Core technology used in this build.";

export function renderTechStackItem(tech, i, projectId) {
  const icon = iconMap[tech];
  const normalizedTech =
    typeof tech === "string" ? tech.trim() : tech || "Unknown";
  const purpose =
    projectPurposeMap[projectId]?.[normalizedTech] || DEFAULT_PURPOSE;

  return (
    <div key={`${projectId}-${normalizedTech}-${i}`} className="tech-stack-row">
      <div className="tech-stack-item">
        <div className="tech-tag-wrapper">
          <div className="tech-tag" title={tech}>
            {icon && <img src={icon} alt={tech} className="tech-icon" />}
            <span className="tech-name">{tech}</span>
          </div>
        </div>
        <div className="tech-purpose-wrapper">
          <span className="tech-arrow">→</span>
          <p className="tech-purpose">{purpose}</p>
        </div>
      </div>
    </div>
  );
}
