// /data/experience/apotheca.js

import { apothecaGalleryImages } from "../../generated/optimizedImages.js";

const gallery = apothecaGalleryImages;

const apotheca = {
  id: "apotheca",
  title: "Full-stack Developer",
  team: "Apotheca | Contract",
  description:
    "Owned SkinPro, a full-stack client operations system for a skincare business, covering records, appointments, photo uploads, follow-up alerts, and prescription generation.",
  outcome:
    "Managed 300+ client records and 2,000+ appointments while saving 1,000+ admin hours per year and $3,000+ in recurring software costs.",
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
    { ...gallery.clientsTab, caption: "Clients Tab" },
    { ...gallery.infoTab, caption: "Info Tab (Client Demographics & History)" },
    { ...gallery.appointmentsTab, caption: "Appointments Tab" },
    { ...gallery.photosTab, caption: "Photos Tab (Before & After Comparison)" },
    { ...gallery.qrUpload, caption: "QR Upload Window" },
    { ...gallery.uploadPhotos, caption: "Upload In Progress" },
    { ...gallery.uploadComplete, caption: "Upload Complete" },
    { ...gallery.rxTab, caption: "Prescriptions Tab" },
    { ...gallery.rxGenerator, caption: "Prescription Generator (Dynamic Form)" },
    { ...gallery.rxPreview, caption: "Finished Prescription Preview (Printable)" },
    { ...gallery.alertsTab, caption: "Alerts Tab (Follow-up Reminders)" },
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
