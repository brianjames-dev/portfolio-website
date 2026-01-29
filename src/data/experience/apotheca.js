// /data/experience/apotheca.js

// Import all project images
import skinpro12 from "../../images/skinpro_imgs/alerts_tab.jpeg";
import skinpro4 from "../../images/skinpro_imgs/appt_tab.jpeg";
import skinpro2 from "../../images/skinpro_imgs/client_tab.jpeg";
import skinpro3 from "../../images/skinpro_imgs/info_tab.jpeg";
import skinpro5 from "../../images/skinpro_imgs/photos_tab_blur.jpeg";
import skinpro6 from "../../images/skinpro_imgs/QR_upload.jpeg";
import skinpro10 from "../../images/skinpro_imgs/rx_generator.jpeg";
import skinpro11 from "../../images/skinpro_imgs/rx_preview.jpeg";
import skinpro9 from "../../images/skinpro_imgs/rx_tab.jpeg";
import skinpro8 from "../../images/skinpro_imgs/Upload_Complete.jpeg";
import skinpro7 from "../../images/skinpro_imgs/Upload_Photos.jpeg";

const apotheca = {
  id: "apotheca",
  title: "Full-stack Developer",
  team: "Apotheca | Remote | Contractual",
  description:
    "Built SkinPro with the business owner to manage 300+ clients and 2,000+ appointments, saving 1,000+ hours/year and $3,000+ in software costs by adding QR-based single-use-token photo uploads (90% faster image handling), automated PDF prescriptions, and an offline-first Next.js UI on local SQLite that avoids $500+/year in cloud fees.",
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
            Apotheca | Remote | Part-time
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
