// /data/projects/bookiebot.js

import {
  bookiebotGalleryImages,
  bookiebotStoryboardImages,
} from "../../generated/optimizedImages.js";

const gallery = bookiebotGalleryImages;
const storyboard = bookiebotStoryboardImages;

const bookiebot = {
  id: "bookiebot",
  title: "BookieBot | AI Agent",
  team: "Solo Project",
  description:
    "AI workflow automation system for shared budgeting: natural-language expense capture, structured validation, Google Sheets sync, multi-user access, and analytics over 30+ query intents.",
  outcome:
    "Replaced a manual spreadsheet workflow with a Discord-native finance agent that logs, validates, queries, and visualizes expenses from normal messages.",
  stack: [
    "Python",
    "Discord.py",
    "Git",
    "OpenAI API",
    "Google Sheets API",
    "Railway",
  ],
  github: "https://github.com/brianjames-dev/bookiebot",
  images: [
    { ...gallery.intentList1, caption: "Intent Recognition List – Page 1" },
    { ...gallery.intentList2, caption: "Intent Recognition List – Page 2" },
    { ...gallery.intentDescExample, caption: "Intent Description + Sample Query" },
    { ...gallery.expenseBreakdown, caption: "Expense Breakdown (Matplotlib)" },
    { ...gallery.spendingCalendar, caption: "Spending Calendar View (Matplotlib)" },
    {
      ...gallery.specificDayExpenses,
      caption: "Expenses on a Specific Day (Matplotlib)",
    },
    { ...gallery.loggedFoodExpense, caption: "Food Log Snapshot" },
    { ...gallery.expenseSheetProof, caption: "Autonomous Logging" },
    { ...gallery.bookiebotIcon, caption: "BookieBot Discord Profile Pic" },
  ],

  expanded: {
    title: `
      BookieBot | AI Agent
    `,
    subtitle: `
      Solo Project
    `,
    github: `
      https://github.com/brianjames-dev/bookiebot
    `,
    description: [
      {
        type: "text",
        className: "desc-text",
        content: `
          BookieBot is an <strong>AI workflow automation system</strong> that lets users log, query, and visualize shared expenses through <strong>natural language</strong>. It supports <strong>multi-user workflows, role-based access, Google Sheets synchronization, and over thirty analytics intents.</strong>
        `,
      },
      {
        type: "group",
        className: "desc-block",
        blocks: [
          {
            type: "image",
            className: "desc-bookiebot-hero-img",
            src: storyboard.bookiebotHero.src,
            alt: "BookieBot UI Hero",
          },
        ],
      },
    ],

    background: `
      BookieBot began with a real workflow problem: my partner and I tracked shared expenses in a custom Google Sheet, but the data entry step was slow enough that the spreadsheet drifted out of date. I built a Discord-native automation layer so the interface became a normal message, while the system handled parsing, validation, logging, and reporting.
    `,

    challenge: `
      We did not have a motivation problem. We had <strong>an interface problem.</strong>
      The budget only worked when data entry happened immediately, but daily life made that unreliable. I replaced the fragile handoff with a bot that could understand short natural-language messages, normalize them into structured records, and keep the spreadsheet trustworthy without extra UI friction.
    `,

    goal: [
      {
        type: "text",
        className: "goal-intro",
        content: `Build a personal finance tool that is <strong>simple and frictionless.</strong>`,
      },
      {
        type: "text",
        className: "goal-intro",
        content: `I wanted the bot to do the following:`,
      },
      {
        type: "group",
        className: "goal-block",
        blocks: [
          {
            type: "image",
            className: "goal-img understanding-cmds-img",
            src: storyboard.understandingCmds.src,
            alt: "Understand natural language",
            caption: "Understand natural language commands",
          },
          {
            type: "image",
            className: "goal-img auto-logging-img",
            src: storyboard.autoLogging.src,
            alt: "Log expenses accurately",
            caption:
              "Log expenses automatically into Google Sheets with accurate information",
          },
          {
            type: "image",
            className: "goal-img bookiebot-inside-img",
            src: storyboard.bookiebotInside.src,
            alt: "Live inside Discord",
            caption: "Live inside a space we already used: Discord",
          },
        ],
      },
    ],

    research: [
      {
        type: "text",
        className: "research-text",
        content: `Most existing solutions (YNAB, Mint, Notion templates) were either too rigid or required dedicated UI interaction. I did not want an additional learning curve for either of us. I realized that a <strong>GPT-powered Discord bot</strong> could act as the interface: something we could message naturally and forget about.`,
      },
      {
        type: "group",
        className: "research-img-block",
        blocks: [
          {
            type: "image",
            className: "research-img-center gpt-powered-img",
            src: storyboard.gptPowered.src,
            alt: "GPT-powered interface",
          },
        ],
      },
      {
        type: "text",
        className: "research-text",
        content: `I wanted the bot to accept normal dialogue for quick use (e.g., $12 sushi) and for each user to get immediate confirmation.`,
      },
      {
        type: "group",
        className: "research-img-block",
        blocks: [
          {
            type: "image",
            className: "research-img-center natural-lang-img",
            src: storyboard.normalDialogueConfirmation.src,
            alt: "Natural language logging",
          },
        ],
      },
      {
        type: "text",
        className: "research-text",
        content: `Mostly, I wanted to not have to touch the spreadsheet at all other than to review at the end of the month, and to easily tune behaviors by updating the prompt rather than rewriting code.`,
      },
      {
        type: "group",
        className: "research-img-block",
        blocks: [
          {
            type: "image",
            className: "research-img-center prompt-structure-img",
            src: storyboard.easyBudgeting.src,
            alt: "Structure prompts for reliability",
          },
        ],
      },
    ],

    techStack: [
      {
        type: "group",
        className: "techstack-block",
        blocks: [
          {
            type: "image",
            className: "techstack-bookiebot-img",
            src: storyboard.techStack.src,
            alt: "BookieBot Tech Stack",
          },
        ],
      },
    ],

    features: [
      {
        type: "group",
        className: "features-block",
        blocks: [
          {
            type: "image",
            className: "feature-img natural-lang2-img",
            src: storyboard.gptCloudToJson.src,
            alt: "Natural Language Logging",
            caption:
              '<strong>Natural Language Logging:</strong><br> Messages like "Target 18.43 groceries" are interpreted by GPT, categorized, and converted to JSON.',
          },
          {
            type: "image",
            className: "feature-img llm-translator-img",
            src: storyboard.brainCircuit.src,
            alt: "LLM-as-a-Translator",
            caption:
              "<strong>LLM-as-a-Translator:</strong><br> Instead of hard-coded commands, GPT handles linguistic flexibility.",
          },
          {
            type: "image",
            className: "feature-img sheets-sync-img",
            src: storyboard.naturalLanguageLogging.src,
            alt: "Google Sheets Sync",
            caption:
              "<strong>Google Sheets Sync:</strong><br> Each expense is logged into a clean, timestamped row in our shared Google Sheet with no human editing required.",
          },
          {
            type: "image",
            className: "feature-img fast-async-img",
            src: storyboard.lightningBookiebot.src,
            alt: "Fast & Async",
            caption:
              "<strong>Fast & Async:</strong><br> Thanks to asyncio, responses are snappy and never block on API calls or logging.",
          },
        ],
      },
    ],

    impact: [
      {
        type: "text",
        className: "impact-intro",
        content: `BookieBot changed how we interact with our finances:`,
      },
      {
        type: "group",
        className: "impact-block",
        blocks: [
          {
            type: "image",
            className: "impact-img one-step-img",
            src: storyboard.steps5to1.src,
            alt: "One-step expense logging",
            caption:
              "Reduced expense logging time from 5+ steps to 1, encouraging consistent budgeting",
          },
          {
            type: "image",
            className: "impact-img analytics-img",
            src: storyboard.increasedUsage.src,
            alt: "Multi-user analytics",
            caption:
              "Enabled multi-user workflows and 30+ analytics intents, increasing savings month to month",
          },
        ],
      },
    ],

    reflection: [
      {
        type: "text",
        className: "reflection-intro",
        content: `BookieBot taught me what practical LLM integration looks like, and showed me that the <strong>best tools often feel invisible</strong> and leave users with an easy, immediate solution to a practical problem.`,
      },
      {
        type: "text",
        className: "reflection-intro",
        content: `Creating BookieBot taught me:`,
      },
      {
        type: "group",
        className: "reflection-block",
        blocks: [
          {
            type: "image",
            className: "reflection-img prompt-reliability-img",
            src: storyboard.structurePromptsReliable.src,
            alt: "Prompt structuring",
            caption: "How to structure prompts for reliability",
          },
          {
            type: "image",
            className: "reflection-img llm-vs-parser-img",
            src: storyboard.llmOutperform.src,
            alt: "LLMs vs Traditional Parsers",
            caption: "Where LLMs outperform traditional parsers",
          },
          {
            type: "image",
            className: "reflection-img async-design-img",
            src: storyboard.asyncArrows.src,
            alt: "Async design",
            caption: "How async design creates responsiveness",
          },
        ],
      },
    ],

    future: [
      {
        type: "text",
        className: "future-intro",
        content: `BookieBot is still evolving. It’s not just a bot; it’s the foundation of a <strong>personal finance agent</strong>.`,
      },
      {
        type: "text",
        className: "future-intro",
        content: `Future directions include:`,
      },
      {
        type: "group",
        className: "future-block",
        blocks: [
          {
            type: "image",
            className: "future-img mobile-dashboard-img",
            src: storyboard.bookiebotFuture.src,
            alt: "Mobile dashboard",
            caption: "Mobile dashboard with custom Google Sheet templates",
          },
          {
            type: "image",
            className: "future-img multi-user-img",
            src: storyboard.multiUser.src,
            alt: "Multi-user mode",
            caption: "Authenticated multi-user mode",
          },
          {
            type: "image",
            className: "future-img visual-insights-img",
            src: storyboard.visualGptSummaries.src,
            alt: "Visual insights",
            caption: "Visual insights powered by GPT summaries",
          },
          {
            type: "image",
            className: "future-img error-handling-img",
            src: storyboard.memoryErrorHandling.src,
            alt: "Error handling & memory",
            caption: "Fine-tuned error handling and conversation memory",
          },
        ],
      },
    ],
  },
};

export default bookiebot;
