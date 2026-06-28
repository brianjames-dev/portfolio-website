// /data/experience/apotheca.js

// Import all project images
import skinpro12 from "./imgs/alerts_tab.jpeg";
import skinpro4 from "./imgs/appt_tab.jpeg";
import skinpro2 from "./imgs/client_tab.jpeg";
import skinpro3 from "./imgs/info_tab.jpeg";
import skinpro5 from "./imgs/photos_tab_blur.jpeg";
import skinpro6 from "./imgs/QR_upload.jpeg";
import skinpro10 from "./imgs/rx_generator.jpeg";
import skinpro11 from "./imgs/rx_preview.jpeg";
import skinpro9 from "./imgs/rx_tab.jpeg";
import skinpro8 from "./imgs/Upload_Complete.jpeg";
import skinpro7 from "./imgs/Upload_Photos.jpeg";

const apotheca = {
  id: "apotheca",
  title: "Full-stack Developer",
  team: "Apotheca | Contract",
  description:
    "Built SkinPro, a custom client and appointment system that cut manual admin work, streamlined photo uploads, and automated prescriptions.",
  stack: [
    "TypeScript",
    "JavaScript",
    "Node.js",
    "NextJS",
    "React",
    "SQLite",
    "Flask",
    "HTML",
    "CSS",
    "Git",
    "PDFKit",
    "Codex",
  ],
  github: "https://github.com/brianjames-dev/SkinPro",
  images: [
    { src: skinpro2, caption: "👩 Clients Tab" },
    { src: skinpro3, caption: "📝 Info Tab (Client Demographics & History)" },
    { src: skinpro4, caption: "📅 Appointments Tab" },
    { src: skinpro5, caption: "📷 Photos Tab (Before & After Comparison)" },
    { src: skinpro6, caption: "📲 QR Upload Window" },
    { src: skinpro7, caption: "📲 Upload In Progress" },
    { src: skinpro8, caption: "📲 Upload Complete" },
    { src: skinpro9, caption: "💊 Prescriptions Tab" },
    { src: skinpro10, caption: "🧾 Prescription Generator (Dynamic Form)" },
    { src: skinpro11, caption: "🖨️ Finished Prescription Preview (Printable)" },
    { src: skinpro12, caption: "🔔 Alerts Tab (Follow-up Reminders)" },
  ],

  expanded: {
    title: `
            Full-stack Developer
        `,

    subtitle: `
            Apotheca | Contract
        `,

    github: `
          https://github.com/brianjames-dev/SkinPro
        `,

    description: `
            •  Spearheaded the SkinPro web application build with the business owner, managing 300+ client records and 2,000+ appointments and saving 1,000+ hours/year of manual work and $3,000+ in software costs.
            •  Implemented QR-based mobile-to-web photo uploads with single-use tokens, cutting image management time by 90%.
            •  Automated prescription output with a dynamic PDFKit generator, replacing handwritten workflows with print-ready outputs.
            •  Built a responsive Next.js UI over a local SQLite store with offline-friendly workflows, avoiding recurring cloud costs.
        `,
  },
};

export default apotheca;
