// /data/projects/marketscope.js

// Import all project images (leave commented for now; will add later)
// import marketscopeIcon from "./imgs/marketscope-icon.png";
// import ms_dashboard from "./imgs/dashboard.png";
// import ms_pipeline from "./imgs/pipeline.png";
// import ms_keyword_report from "./imgs/keyword-report.png";
// import ms_domain_audit from "./imgs/domain-audit.png";
// import ms_geo_heatmap from "./imgs/geo-heatmap.png";

// // Import all storyboard images (leave commented as a guide/template)
// import sb_problem from "./imgs/storyboard/problem.png";
// import sb_hypothesis from "./imgs/storyboard/hypothesis.png";
// import sb_system from "./imgs/storyboard/system.png";
// import sb_scoring from "./imgs/storyboard/scoring.png";
// import sb_value from "./imgs/storyboard/value.png";
// import sb_future from "./imgs/storyboard/future.png";

const marketscope = {
  id: "marketscope",
  title: "MarketScope",
  team: "2-Person Team",
  description:
    "MarketScope discovers local businesses actively running Google Ads, estimates keyword economics (CPC, volume, competition), benchmarks landing pages, and generates outreach-ready lead reports for agencies and SMBs.",
  stack: [
    "TypeScript",
    "React",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Docker",
    "GCP",
    "SerpAPI",
    "Google Ads",
    "Pandas",
    "Playwright",
  ],
  // github: "https://github.com/brianjames-dev/marketscope",

  // Leave image references commented out for now; we’ll attach assets later.
  // images: [
  //   { src: ms_dashboard, caption: "Prospect Dashboard & Lead Scores" },
  //   { src: ms_pipeline, caption: "Data Pipeline: Crawl → Enrich → Score" },
  //   { src: ms_keyword_report, caption: "Keyword CPC & Volume Snapshot" },
  //   { src: ms_domain_audit, caption: "Landing Page Audit & Benchmarks" },
  //   { src: ms_geo_heatmap, caption: "Geo Heatmap of Ad Coverage" },
  //   { src: marketscopeIcon, caption: "MarketScope App Icon" },
  // ],

  expanded: {
    title: `
      MarketScope
    `,
    subtitle: `
      2-Person Team
    `,
    // github: `
    //   https://github.com/brianjames-dev/marketscope
    // `,
    description: [
      {
        type: "text",
        className: "desc-text",
        content: `
          MarketScope is a <strong>lead intelligence and research platform</strong> that helps agencies and local businesses find <strong>who is advertising</strong> in specific niches and zip codes, <strong>what keywords they buy</strong>, and <strong>where spend is likely wasted</strong>. It compiles <strong>outreach-ready briefs</strong> with CPC, volume, competitive density, ad copy snapshots, and landing-page quality signals.
        `,
      },
      // {
      //   type: "group",
      //   className: "desc-block",
      //   blocks: [
      //     {
      //       type: "image",
      //       className: "desc-hero-img",
      //       src: ms_dashboard,
      //       alt: "MarketScope UI Hero",
      //     },
      //   ],
      // },
    ],

    background: `
      I built MarketScope after repeatedly needing a <strong>clean, programmatic way</strong> to discover <em>local advertisers</em> and quantify <em>keyword economics</em> for niches like “concrete contractor” or “roof repair.” Manual checks in search engines were slow and inconsistent. Existing tools favored national brands or required expensive seats. I wanted a <strong>developer-friendly pipeline</strong> that generated <strong>actionable lead lists and one-pager briefs</strong> I could send the same day.
    `,

    challenge: `
      The core challenge was <strong>joining messy signals</strong> across sources (SERP snapshots, business directories, ad previews, landing-page audits) into a <strong>trustworthy score</strong>:<br/>
      • Identify <em>who’s actually running ads</em> in a geography<br/>
      • Estimate <em>keyword CPC &amp; volume</em> with blended sources<br/>
      • Assess <em>landing-page quality</em> (load, mobile, CTAs, forms, trust)<br/>
      • Output <em>clear recommendations</em> for non-technical owners
    `,

    goal: [
      {
        type: "text",
        className: "goal-intro",
        content: `Deliver a repeatable system that turns a query like <strong>“concrete contractor — Tyler, TX”</strong> into a <strong>ranked lead list</strong> with <strong>keyword plan</strong> and <strong>audit-backed talking points</strong> in under an hour.`,
      },
      {
        type: "text",
        className: "goal-intro",
        content: `Product outcomes I targeted:`,
      },
      {
        type: "group",
        className: "goal-block",
        blocks: [
          // {
          //   type: "image",
          //   className: "goal-img",
          //   src: sb_problem,
          //   alt: "Problem framing",
          //   caption: "Pinpoint active advertisers by niche + geo",
          // },
          // {
          //   type: "image",
          //   className: "goal-img",
          //   src: sb_system,
          //   alt: "System view",
          //   caption: "Blend CPC/volume sources into stable estimates",
          // },
          // {
          //   type: "image",
          //   className: "goal-img",
          //   src: sb_scoring,
          //   alt: "Scoring",
          //   caption: "Score landing pages for conversion readiness",
          // },
          {
            type: "text",
            className: "goal-bullets",
            content: `
              • Discover active Google Ads buyers by query & ZIP<br/>
              • Estimate CPC/volume & competition reliably<br/>
              • Audit landing pages for speed, mobile, CTAs, trust<br/>
              • Produce outreach-ready briefs and CSV lead exports
            `,
          },
        ],
      },
    ],

    research: [
      {
        type: "text",
        className: "research-text",
        content: `
          I compared incumbent tools (SEMrush, SpyFu, Similarweb) and found gaps for <strong>hyper-local discovery</strong> and <strong>batch workflows</strong>. I validated the workflow with a small set of local niches and iterated on data freshness, proxy hygiene, and respectful SERP access using <strong>SerpAPI</strong> for compliance and reliability.
        `,
      },
      // {
      //   type: "group",
      //   className: "research-img-block",
      //   blocks: [
      //     { type: "image", className: "research-img-center", src: sb_hypothesis, alt: "Hypothesis storyboard" },
      //   ],
      // },
      {
        type: "text",
        className: "research-text",
        content: `
          A simple insight improved precision: <em>pair SERP ad detections with domain-level crawling</em> to confirm contactability (valid forms/phones/emails) and enrich with <strong>business registry & review data</strong> where available. This raised reply-rates and reduced dead leads.
        `,
      },
    ],

    techStack: [
      {
        type: "group",
        className: "techstack-block",
        blocks: [
          // {
          //   type: "image",
          //   className: "techstack-img",
          //   src: ms_pipeline,
          //   alt: "MarketScope Tech Stack",
          // },
          // {
          //   type: "text",
          //   className: "techstack-text",
          //   content: `
          //     <strong>Frontend:</strong> React + TypeScript (dashboard, filters, exports)<br/>
          //     <strong>Backend:</strong> FastAPI (REST), Python jobs (ingestion, audits)<br/>
          //     <strong>Data:</strong> PostgreSQL (facts & reports), Redis (queues/cache)<br/>
          //     <strong>Automation:</strong> Cloud Scheduler + containers (batch runs)<br/>
          //     <strong>Integrations:</strong> SerpAPI, Google Ads API (where permitted)
          //   `,
          // },
        ],
      },
    ],

    features: [
      {
        type: "group",
        className: "features-block",
        blocks: [
          // {
          //   type: "image",
          //   className: "feature-img",
          //   src: ms_keyword_report,
          //   alt: "Keyword economics",
          //   caption: "<strong>Keyword Economics:</strong><br/>Blended CPC/volume & competitive density by niche and ZIP.",
          // },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Local Advertiser Discovery:</strong> Identifies businesses running ads for target queries across chosen ZIP codes with SERP snapshots.",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Landing-Page Audits:</strong> Headless checks for speed, mobile layout, CTAs, forms, trust elements, and tracking pixels.",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Lead Scoring:</strong> Combines ad presence, keyword fit, page quality, and contactability into a transparent score.",
          },
          {
            type: "text",
            className: "feature-text",
            content:
              "<strong>Deliverables:</strong> One-pager briefs per prospect (PDF) + CSV exports + talking-point bullets for email outreach.",
          },
        ],
      },
    ],

    impact: [
      {
        type: "text",
        className: "impact-intro",
        content: `MarketScope condensed hours of manual research into an automated workflow and produced <strong>consistent, outreach-ready materials</strong>.`,
      },
      {
        type: "group",
        className: "impact-block",
        blocks: [
          // {
          //   type: "image",
          //   className: "impact-img",
          //   src: sb_value,
          //   alt: "Value storyboard",
          //   caption: "Faster prospecting, clearer recommendations.",
          // },
          {
            type: "text",
            className: "impact-bullets",
            content: `
              • <strong>Prospecting speed:</strong> From ad-hoc browsing to systematic lists.<br/>
              • <strong>Better emails:</strong> Specific keyword & page insights increase replies.<br/>
              • <strong>Repeatability:</strong> Same recipe across new cities/niches.
            `,
          },
        ],
      },
    ],

    reflection: [
      {
        type: "text",
        className: "reflection-intro",
        content: `
          Shipping MarketScope reinforced a pattern: <strong>join multiple “okay” signals into one reliable score</strong>. The value isn’t a single metric—it’s the <em>blend</em> and the <em>explainability</em> behind it.
        `,
      },
      {
        type: "group",
        className: "reflection-block",
        blocks: [
          // {
          //   type: "image",
          //   className: "reflection-img",
          //   src: sb_system,
          //   alt: "System reflection",
          //   caption: "Narrow, well-documented interfaces kept the pipeline stable.",
          // },
          {
            type: "text",
            className: "reflection-text",
            content:
              "Narrow API contracts (ingest, enrich, score) made it easy to test pieces in isolation and keep costs predictable.",
          },
          {
            type: "text",
            className: "reflection-text",
            content:
              "Investing in <em>contactability checks</em> up front saved time—bounced outreach is the hidden tax of prospecting.",
          },
        ],
      },
    ],

    future: [
      {
        type: "text",
        className: "future-intro",
        content: `
          The roadmap focuses on <strong>deeper enrichment</strong> and <strong>lighter sales enablement</strong> features:
        `,
      },
      {
        type: "group",
        className: "future-block",
        blocks: [
          // {
          //   type: "image",
          //   className: "future-img",
          //   src: sb_future,
          //   alt: "Future storyboard",
          //   caption: "Playbooks, alerts, and pipeline integrations.",
          // },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Playbooks:</strong> Auto-generated outreach drafts with keyword & audit talking points.",
          },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Change Alerts:</strong> Notify when competitors enter/exit auctions or update landing pages.",
          },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Integrations:</strong> Pipedrive/HubSpot sync; webhook exports to existing CRMs.",
          },
          {
            type: "text",
            className: "future-text",
            content:
              "• <strong>Deeper Ads Data:</strong> Expanded use of Google Ads API where policy and access permit.",
          },
        ],
      },
    ],
  },
};

export default marketscope;
