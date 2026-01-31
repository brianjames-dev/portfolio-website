// /data/experience/insurity.js

// Import all project images
import chat from "./imgs/chat.jpeg";
import deploy from "./imgs/deploy.jpeg";
import discovery from "./imgs/discovery.jpeg";
import login from "./imgs/login.jpeg";
import monitor from "./imgs/monitor.jpeg";
import semantics from "./imgs/semantics.jpeg";
import simulate1 from "./imgs/simulate1.jpeg";
import simulate2 from "./imgs/simulate2.jpeg";
import stage from "./imgs/stage.jpeg";
import timeline from "./imgs/timeline.jpeg";

const insurity = {
  id: "insurity",
  title: "AI Associate Developer",
  team: "Insurity | Remote | Part-time",
  description:
    "Built an AI-powered database performance agent with FastAPI and LangGraph that orchestrated schema analysis, index discovery, simulation, deployment, and monitoring across multiple systems to streamline DBA workflows. Developed a FastAPI + SQLAlchemy REST backend to support schema and index processes, and created Python/SQL Server indexing toolkits to surface production-ready indexes and improve performance on high-traffic queries. Led a legacy .NET cookie migration to speed up page loads, reduce request overhead, and address session security issues.",
  stack: [
    "C#",
    ".NET",
    "TypeScript",
    "Python",
    "SQL",
    "LangGraph",
    "Azure OpenAI",
    "FastAPI",
    "NextJS",
    "Pydantic",
    "SQLAlchemy",
    "RAG",
    "Prompt Engineering",
    "VS 2022",
    "XML",
    "Replit",
    "Git",
    "Microsoft SQL Server",
    "HTML",
    "CSS",
    "REST API",
  ],
  github: "",
  galleryLocked: true,
  showGalleryButton: true,
  demoVideo: {
    provider: "youtube",
    id: "OlipJCRyRo4",
    title: "AI Associate Developer Demo",
  },
  images: [
    { src: login, caption: "Login flow" },
    { src: discovery, caption: "Discovery view" },
    { src: semantics, caption: "Semantic analysis" },
    { src: simulate1, caption: "Simulation view (1)" },
    { src: simulate2, caption: "Simulation view (2)" },
    { src: stage, caption: "Staging workflow" },
    { src: deploy, caption: "Deployment view" },
    { src: monitor, caption: "Monitoring dashboard" },
    { src: chat, caption: "Assistant chat" },
    { src: timeline, caption: "Activity timeline" },
  ],

  expanded: {
    title: `
            AI Associate Developer
        `,

    subtitle: `
            Insurity | Remote | Part-time
        `,

    // github: `

    //     `,

    description: `
            •  Engineered an AI-powered Database Performance Agent using LangGraph and Azure OpenAI, orchestrating 12 tool intents that automated index optimization across 34 databases, reducing manual DBA analysis time by 80%.
            •  Owned a full-stack Database Performance Agent with Next.js/React frontend and FastAPI backend, featuring real-time chat and server-side pagination handling 894 tables and 2,175 stored procedures.
            •  Led a cookie migration project refactoring 170+ files across a legacy ASP.NET/.NET codebase, achieving 51% faster page loads and eliminating 4 security vulnerabilities.
            •  Built Python/SQL Server indexing toolkits that lifted high-traffic query performance 40-60% by surfacing 400-600 indexes.
        `,
  },
};

export default insurity;
