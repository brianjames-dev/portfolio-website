// /data/projects/snoozeai.js

// Import all project images (leave commented for now; will attach assets later)
// import snoozeaiIcon from "./imgs/snoozeai-icon.png";
// import sa_ios_home from "./imgs/ios-home.png";
// import sa_ios_snooze from "./imgs/ios-snooze-sheet.png";
// import sa_ios_digest from "./imgs/ios-digest.png";
// import sa_rules from "./imgs/rules-builder.png";
// import sa_inbox from "./imgs/inbox-triage.png";
// import sa_metrics from "./imgs/metrics.png";

// // Import storyboard images (leave commented as a guide/template)
// import sb_problem from "./imgs/storyboard/problem.png";
// import sb_flow from "./imgs/storyboard/flow.png";
// import sb_arch from "./imgs/storyboard/architecture.png";
// import sb_model from "./imgs/storyboard/model.png";
// import sb_value from "./imgs/storyboard/value.png";
// import sb_future from "./imgs/storyboard/future.png";

const snoozeai = {
  id: "snoozeai",
  title: "SnoozeAI | AI Notification Agent",
  team: "Solo Project",
  description:
    "SnoozeAI is an iOS + cloud agent that classifies, summarizes, and schedules your notifications. It auto-snoozes low-urgency pings, bundles digests, and lets truly urgent alerts break through—reducing distraction without missing what matters.",

  stack: [
    "Swift",
    "Python",
    "FastAPI",
    "OpenAI API",
    "Firebase",
    "Firestore",
    "GCP",
    "APNs / FCM",
    "SQLite",
    "Docker",
    "Xcode",
  ],

  github: "https://github.com/brianjames-dev/SnoozeAI",

  // Leave image references commented out for now; we’ll attach assets later.
  // images: [
  //   { src: sa_ios_home, caption: "Home: Focus status, next digest, recent VIPs" },
  //   { src: sa_ios_snooze, caption: "Inline Snooze Sheet (5m • 1h • Tonight • Custom)" },
  //   { src: sa_ios_digest, caption: "Smart Digest: grouped summaries + quick triage" },
  //   { src: sa_rules, caption: "Rules Builder: per-app, per-sender, keyword, time windows" },
  //   { src: sa_inbox, caption: "AI Inbox: 'Act Now', 'Later Today', 'Someday'" },
  //   { src: sa_metrics, caption: "Metrics: interruptions avoided, time saved" },
  //   { src: snoozeaiIcon, caption: "SnoozeAI App Icon" },
  // ],

  expanded: {
    title: `
      SnoozeAI | AI Notification Agent
    `,
    subtitle: `
      Solo Project
    `,
    github: `
      https://github.com/brianjames-dev/SnoozeAI
    `,
    description: [
      {
        type: "text",
        className: "desc-text",
        content: `
          SnoozeAI is a <strong>notification firewall + concierge</strong> for iOS. It <strong>classifies urgency</strong>, <strong>summarizes</strong> long alerts, and <strong>schedules delivery</strong> for low-priority pings as digests—while allowing <strong>VIP and urgent</strong> items to break through instantly. The result is fewer interruptions and better attention management, without missing important messages.
        `,
      },
      // {
      //   type: "group",
      //   className: "desc-block",
      //   blocks: [
      //     { type: "image", className: "desc-hero-img", src: sa_ios_home, alt: "SnoozeAI iOS UI Hero" },
      //   ],
      // },
    ],

    background: `
      Between school, an internship, and side projects, my phone became a slot machine. System-level Focus Modes helped, but they were <em>binary</em>. I needed something <strong>context-aware</strong> that could tell the difference between a bank fraud alert and a social like, between “reply ASAP” and “read tonight.” SnoozeAI started as a class project and evolved into a daily driver: a <strong>personal notification agent</strong>.
    `,

    challenge: `
      iOS notifications are optimized for delivery, not <strong>decision-making</strong>. The hard part wasn’t receiving pushes—it was <strong>triage</strong>:<br/>
      • Parse <em>heterogeneous payloads</em> (bank alerts, chat previews, CI failures, calendar nudges)<br/>
      • <em>Classify urgency</em> using content + source + time (and learn user preferences)<br/>
      • <em>Summarize</em> long messages into one-liners for lock-screen scanning<br/>
      • <em>Schedule</em> or snooze intelligently without breaking critical SLAs
    `,

    goal: [
      {
        type: "text",
        className: "goal-intro",
        content: `Minimize interruptions while preserving <strong>speed on true urgencies</strong> and <strong>recall on everything else</strong>.`,
      },
      {
        type: "text",
        className: "goal-intro",
        content: `Product outcomes targeted:`,
      },
      {
        type: "group",
        className: "goal-block",
        blocks: [
          // { type: "image", className: "goal-img", src: sb_problem, alt: "Problem framing", caption: "Too many pings, too little context" },
          // { type: "image", className: "goal-img", src: sb_flow, alt: "Flow", caption: "Classify → Summarize → Deliver/Snooze" },
          // { type: "image", className: "goal-img", src: sb_arch, alt: "Arch", caption: "On-device + Cloud inference with privacy guardrails" },
          {
            type: "text",
            className: "goal-bullets",
            content: `
              • <strong>Urgency classifier</strong> (Now / Soon / Later).<br/>
              • <strong>One-line summaries</strong> directly in the notification.<br/>
              • <strong>Auto-snooze</strong> to windows (Lunch, Evening, Weekend).<br/>
              • <strong>VIP bypass</strong> + per-app rules + Do-Not-Disturb respect.<br/>
              • <strong>Digest bundles</strong> with quick triage (Archive, Pin, Open).`,
          },
        ],
      },
    ],

    research: [
      {
        type: "text",
        className: "research-text",
        content: `
          I benchmarked manual rules vs. LLM-assisted classification. Heuristics alone under-fit real life. A hybrid worked best: <strong>rules for always/never cases</strong> (e.g., bank, pager) and an <strong>LLM for edge contexts</strong> (e.g., nuanced Slack threads). Summaries use a constrained prompt to produce <em>single-sentence</em> outputs with action verbs.
        `,
      },
      // {
      //   type: "group",
      //   className: "research-img-block",
      //   blocks: [
      // { type: "image", className: "research-img-center", src: sb_model, alt: "Classifier prompt & schema" },
      //   ],
      // },
      {
        type: "text",
        className: "research-text",
        content: `
          On iOS, a <strong>Notification Service Extension</strong> enriches payloads on delivery, keeping round-trips minimal. For privacy, <em>sender names and message bodies are redacted</em> before cloud calls unless the app is whitelisted; otherwise summaries run on-device from metadata or use template fields.
        `,
      },
    ],

    techStack: [
      {
        type: "group",
        className: "techstack-block",
        blocks: [
          // { type: "image", className: "techstack-img", src: sb_arch, alt: "High-level architecture" },
          {
            type: "text",
            className: "techstack-text",
            content: `
              <strong>iOS:</strong> SwiftUI app, Notification Service Extension, local scheduling, Focus awareness<br/>
              <strong>Backend:</strong> FastAPI (Python) on Cloud Run; Webhooks for provider integrations<br/>
              <strong>AI:</strong> OpenAI API for summarization & urgency classification (guardrailed prompts, JSON schema)<br/>
              <strong>Data:</strong> Firestore (profiles, rules, digests), Firebase Auth; SQLite cache on device<br/>
              <strong>Push:</strong> APNs/FCM; signed JWT for provider → SnoozeAI ingest<br/>
              <strong>Ops:</strong> Docker, CI/CD, canary flagging, structured logging
            `,
          },
        ],
      },
    ],

    features: [
      {
        type: "group",
        className: "features-block",
        blocks: [
          // { type: "image", className: "feature-img", src: sa_ios_snooze, alt: "Snooze sheet", caption: "<strong>Inline Snooze:</strong> 5m, 1h, Tonight, Custom" },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Urgency Classifier:</strong> Combines sender reputation, keywords, temporal context, and content to label Now / Soon / Later.",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>One-Line Summaries:</strong> Converts verbose alerts into crisp, actionable headlines on the lock screen.",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Smart Snooze & Digests:</strong> Auto-bundles low-priority items into time windows you choose (Lunch, Evening, Weekend).",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Rules & VIPs:</strong> Per-app/per-sender rules, keyword exceptions, and VIP bypass for critical contacts.",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Privacy Controls:</strong> Redaction by default; on-device only mode; per-app data permissions.",
          },
        ],
      },
    ],

    impact: [
      {
        type: "text",
        className: "impact-intro",
        content: `In personal trials over several weeks, SnoozeAI reduced <strong>lock-screen interruptions</strong> and improved end-of-day recall:`,
      },
      {
        type: "group",
        className: "impact-block",
        blocks: [
          // { type: "image", className: "impact-img", src: sb_value, alt: "Value storyboard", caption: "Fewer pings, more focus" },
          {
            type: "text",
            className: "impact-bullets",
            content: `
              • ~<strong>40–60%</strong> fewer real-time alerts during work blocks.<br/>
              • <strong>0 missed VIP</strong> notifications (bypass rules).<br/>
              • <strong>Faster triage</strong> via summaries and grouped digests.`,
          },
        ],
      },
    ],

    reflection: [
      {
        type: "text",
        className: "reflection-intro",
        content: `
          The hardest part wasn’t the model—it was the <strong>product semantics</strong>: what “urgent” means changes by person, app, and time. A <em>hybrid of rules + LLM</em> with transparent controls built user trust. System-level integration (Service Extension) kept the experience fast enough to feel native.
        `,
      },
      {
        type: "group",
        className: "reflection-block",
        blocks: [
          // { type: "image", className: "reflection-img", src: sb_flow, alt: "Flow", caption: "Fast path for urgent, slow path for the rest" },
          {
            type: "text",
            className: "reflection-text",
            content:
              "Designing <em>failure modes</em> (e.g., model timeout → fall back to rules) mattered more than squeezing a few points of accuracy.",
          },
          {
            type: "text",
            className: "reflection-text",
            content:
              "Clear <em>explanations</em> (why a ping was snoozed) prevented confusion and made the system feel collaborative, not opaque.",
          },
        ],
      },
    ],

    future: [
      {
        type: "text",
        className: "future-intro",
        content: `
          Next up: richer context and broader coverage—without sacrificing privacy or speed.
        `,
      },
      {
        type: "group",
        className: "future-block",
        blocks: [
          // { type: "image", className: "future-img", src: sb_future, alt: "Future", caption: "Calendar awareness, inbox integrations, learning" },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Calendar & Location Awareness:</strong> Adjust thresholds during meetings, commutes, or sleep.",
          },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Learning Mode:</strong> Periodic review cards to accept/undo decisions and fine-tune preferences.",
          },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Provider Integrations:</strong> Gmail/Slack webhooks → unified triage with the same classifier.",
          },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>On-device Models:</strong> Expand local inference to minimize round-trips and increase privacy.",
          },
        ],
      },
    ],
  },
};

export default snoozeai;
