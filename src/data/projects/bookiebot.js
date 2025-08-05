// /data/projects/bookiebot.js

// Import all project images
import bookiebot1 from '../../images/bookiebot_imgs/bookiebot-icon.png';
import bookiebot2 from '../../images/bookiebot_imgs/intent-list-1.png';
import bookiebot3 from '../../images/bookiebot_imgs/intent-list-2.png';
import bookiebot4 from '../../images/bookiebot_imgs/intent-desc+example.png';
import bookiebot5 from '../../images/bookiebot_imgs/expense-breakdown.png';
import bookiebot6 from '../../images/bookiebot_imgs/spending-calendar.png';
import bookiebot7 from '../../images/bookiebot_imgs/specific-day-expenses.png';
import bookiebot8 from '../../images/bookiebot_imgs/logged-food-expense.png';
import bookiebot9 from '../../images/bookiebot_imgs/expense-sheet-proof.png';

// Import all storyboard images
import steps5to1 from '../../images/bookiebot_imgs/storyboard_imgs/5stepsTo1.png';
import asyncArrows from '../../images/bookiebot_imgs/storyboard_imgs/async_arrows.png';
import autoLogging from '../../images/bookiebot_imgs/storyboard_imgs/automatic_logging.png';
import bookiebotFuture from '../../images/bookiebot_imgs/storyboard_imgs/bookiebot_future.png';
import bookiebotHero from '../../images/bookiebot_imgs/storyboard_imgs/bookiebot_hero.png';
import bookiebotInside from '../../images/bookiebot_imgs/storyboard_imgs/bookiebot_inside.png';
import brainCircuit from '../../images/bookiebot_imgs/storyboard_imgs/brain_circuit.png';
import GPTpowered from '../../images/bookiebot_imgs/storyboard_imgs/GPT_powered_bookiebot.png';
import GPTcloudToJson from '../../images/bookiebot_imgs/storyboard_imgs/GPTcloudToJson.png';
import increasedUsage from '../../images/bookiebot_imgs/storyboard_imgs/increased_usage.png';
import lightningBookiebot from '../../images/bookiebot_imgs/storyboard_imgs/lightning_bookiebot.png';
import llmOutperform from '../../images/bookiebot_imgs/storyboard_imgs/llm_outperform.png';
import memoryErrorHandling from '../../images/bookiebot_imgs/storyboard_imgs/memory_error_handling.png';
import multiUser from '../../images/bookiebot_imgs/storyboard_imgs/multi_user.png';
import nrmlDialogueConf from '../../images/bookiebot_imgs/storyboard_imgs/normal_dialogue_confirmation.png';
import easyBudgeting from '../../images/bookiebot_imgs/storyboard_imgs/easy_budgeting.png';
import naturalLanguageLogging1 from '../../images/bookiebot_imgs/storyboard_imgs/natural_language_logging1.png';
import naturalLanguageLogging2 from '../../images/bookiebot_imgs/storyboard_imgs/natural_language_logging2.png';
import structurePromptsReliable from '../../images/bookiebot_imgs/storyboard_imgs/structure_prompts_reliable.png';
import techStack from '../../images/bookiebot_imgs/storyboard_imgs/techstack.png';
import understandingCmds from '../../images/bookiebot_imgs/storyboard_imgs/understanding_cmds.png';
import visualGPTsummaries from '../../images/bookiebot_imgs/storyboard_imgs/visual_GPT_summaries.png';

const bookiebot = {
  id: 'bookiebot',
  title: 'BookieBot',
  team: 'Solo',
  description:
    'BookieBot is an autonomous AI finance chatbot that allows users to log, query, and visualize their expenses using natural language and supports multi-user workflows, role-based access, and over 30 analytics intents.',
  stack: ['Python', 'Discord.py', 'Git', 'OpenAI API', 'Google Sheets API', 'Railway'],
  github: 'https://github.com/brianjames-dev/bookiebot',
  images: [
    { src: bookiebot2, caption: 'Intent Recognition List – Page 1' },
    { src: bookiebot3, caption: 'Intent Recognition List – Page 2' },
    { src: bookiebot4, caption: 'Intent Description + Sample Query' },
    { src: bookiebot5, caption: 'Expense Breakdown (Matplotlib)' },
    { src: bookiebot6, caption: 'Spending Calendar View (Matplotlib)' },
    { src: bookiebot7, caption: 'Expenses on a Specific Day Matplotlib)' },
    { src: bookiebot8, caption: 'Food Log Snapshot' },
    { src: bookiebot9, caption: 'Autonomous Logging' },
    { src: bookiebot1, caption: 'BookieBot Discord Profile Pic' },
  ],

  expanded: {
    title: `
      BookieBot - AI Agent
    `,
    subtitle: `
      Solo Project
    `,
    github: `
      https://github.com/brianjames-dev/bookiebot
    `,
    description: [
      {
        type: 'group',
        className: 'desc-block',
        blocks: [
          {
            type: 'text',
            className: 'desc-text',
            content: `
              BookieBot is an <strong>autonomous AI finance chatbot</strong> that allows users to log, query, and visualize their expenses with <strong>natural language</strong> and supports <strong>multi-user workflows, role-based access, and over thirty analytics intents.</strong>
            `
          },
          {
            type: 'image',
            className: 'desc-bookiebot-hero-img',
            src: bookiebotHero,
            alt: 'BookieBot UI Hero'
          }
        ]
      }
    ],

    background: `
      BookieBot began as a solution for a personal problem: my partner and I tracked our shared expenses using a custom Google Sheets budget, but logging purchases meant stopping what we were doing, switching tabs, finding the right row, and formatting everything correctly — a small but constant friction that made budgeting feel like a chore, which meant we didn’t do it. BookieBot was born out of our need for a simple, user-friendly solution to allow expense input to become simpler.
    `,

    challenge: `
      We didn’t have a logging problem — we had <strong>a convenience problem.</strong>
      Even though we were motivated to budget together, the workflow wasn’t compatible with daily life. In moments when we were busy or distracted — grabbing coffee, getting groceries — we’d forget to log things, lose receipts, and the data would slowly drift further away from cohesive and correct. To keep things simple in the beginning, my partner would drop a message into our shared Discord with the amount and item of their purchase, which I would gradually enter into the shared spreadsheet. At a certain point, I realized I was working harder, and not smarter. What if budgeting was as simple as chatting?
    `,

    goal: [
      {
        type: 'text',
        className: 'goal-intro',
        content: `Build a personal finance tool that is <strong>simple and frictionless.</strong>`
      },
      {
        type: 'text',
        className: 'goal-intro',
        content: `I wanted the bot to do the following:`
      },
      {
        type: 'group',
        className: 'goal-block',
        blocks: [
          {
            type: 'image',
            className: 'goal-img understanding-cmds-img',
            src: understandingCmds,
            alt: 'Understand natural language',
            caption: 'Understand natural language commands'
          },
          {
            type: 'image',
            className: 'goal-img auto-logging-img',
            src: autoLogging,
            alt: 'Log expenses accurately',
            caption: 'Log expenses automatically into Google Sheets with accurate information'
          },
          {
            type: 'image',
            className: 'goal-img bookiebot-inside-img',
            src: bookiebotInside,
            alt: 'Live inside Discord',
            caption: 'Live inside a space we already used: Discord'
          }
        ]
      }
    ],
      
    research: [
        {
          type: 'group',
          className: 'research-row row-1',
          blocks: [
            {
              type: 'text',
              className: 'research-text research-text-row1',
              content: `Most existing solutions (YNAB, Mint, Notion templates) were either too rigid or required dedicated UI interaction. I didn’t want an additional learning curve for either of us. I realized that a <strong>GPT-powered Discord bot</strong> could act as the "interface" — something we could message naturally and forget about.`
            },
            {
              type: 'group',
              className: 'img-wrapper img-right',
              blocks: [
                {
                  type: 'image',
                  className: 'research-img gpt-powered-img',
                  src: GPTpowered,
                  alt: 'GPT-powered interface'
                }
              ]
            }
          ]
        },
        {
          type: 'group',
          className: 'research-row row-2',
          blocks: [
            {
              type: 'group',
              className: 'img-wrapper img-left',
              blocks: [
                {
                  type: 'image',
                  className: 'research-img natural-lang-img',
                  src: nrmlDialogueConf,
                  alt: 'Natural language logging'
                }
              ]
            },
            {
              type: 'text',
              className: 'research-text research-text-row2',
              content: `I wanted the bot to accept normal dialogue for quick use (e.g., $12 sushi) and for each user to get immediate confirmation.`
            }
          ]
        },
        {
          type: 'group',
          className: 'research-row row-3',
          blocks: [
            {
              type: 'text',
              className: 'research-text research-text-row3',
              content: `Mostly, I wanted to not have to touch the spreadsheet at all other than to review at the end of the month, and to easily tune behaviors by updating the prompt rather than rewriting code.`
            },
            {
              type: 'group',
              className: 'img-wrapper img-right',
              blocks: [
                {
                  type: 'image',
                  className: 'research-img prompt-structure-img',
                  src: easyBudgeting,
                  alt: 'Structure prompts for reliability'
                }
              ]
            }
          ]
        }
      ],        
      
    techStack: [
      {
        type: 'group',
        className: 'techstack-block',
        blocks: [
          {
            type: 'image',
            className: 'techstack-bookiebot-img',
            src: techStack,
            alt: 'BookieBot Tech Stack'
          }
        ]
      }
    ],

    features: [
        {
          type: 'group',
          className: 'features-block',
          blocks: [
            {
              type: 'image',
              className: 'feature-img natural-lang2-img',
              src: GPTcloudToJson,
              alt: 'Natural Language Logging',
              caption: 'Natural Language Logging: Messages like "Target 18.43 groceries" are interpreted by GPT, categorized, and converted to JSON.'
            },
            {
              type: 'image',
              className: 'feature-img llm-translator-img',
              src: brainCircuit,
              alt: 'LLM-as-a-Translator',
              caption: 'LLM-as-a-Translator: Instead of hard-coded commands, GPT handles linguistic flexibility.'
            },
            {
              type: 'image',
              className: 'feature-img sheets-sync-img',
              src: naturalLanguageLogging2,
              alt: 'Google Sheets Sync',
              caption: 'Google Sheets Sync: Each expense is logged into a clean, timestamped row in our shared Google Sheet — no human editing required.'
            },
            {
              type: 'image',
              className: 'feature-img fast-async-img',
              src: lightningBookiebot,
              alt: 'Fast & Async',
              caption: 'Fast & Async: Thanks to asyncio, responses are snappy and never block on API calls or logging.'
            }
          ]
        }
      ],      

      impact: [
        {
          type: 'text',
          className: 'impact-intro',
          content: `BookieBot changed how we interact with our finances:`
        },
        {
          type: 'group',
          className: 'impact-block',
          blocks: [
            {
              type: 'image',
              className: 'impact-img one-step-img',
              src: steps5to1,
              alt: 'One-step expense logging',
              caption: 'Reduced expense logging time from 5+ steps to 1, encouraging consistent budgeting'
            },
            {
              type: 'image',
              className: 'impact-img analytics-img',
              src: increasedUsage,
              alt: 'Multi-user analytics',
              caption: 'Enabled multi-user workflows and 30+ analytics intents, increasing savings month to month'
            }
          ]
        }
      ],

      reflection: [
        {
          type: 'text',
          className: 'reflection-intro',
          content: `BookieBot taught me what practical LLM integration looks like, and showed me that the <strong>best tools often feel invisible</strong> and leave users with an easy, immediate solution to a practical problem.`
        },
        {
            type: 'text',
            className: 'reflection-intro',
            content: `Creating BookieBot taught me:`
        },
        {
          type: 'group',
          className: 'reflection-block',
          blocks: [
            {
              type: 'image',
              className: 'reflection-img prompt-reliability-img',
              src: structurePromptsReliable,
              alt: 'Prompt structuring',
              caption: 'How to structure prompts for reliability'
            },
            {
              type: 'image',
              className: 'reflection-img llm-vs-parser-img',
              src: llmOutperform,
              alt: 'LLMs vs Traditional Parsers',
              caption: 'Where LLMs outperform traditional parsers'
            },
            {
              type: 'image',
              className: 'reflection-img async-design-img',
              src: asyncArrows,
              alt: 'Async design',
              caption: 'How async design creates responsiveness'
            }
          ]
        }
      ],      

      future: [
        {
          type: 'text',
          className: 'future-intro',
          content: `BookieBot is still evolving. It’s not just a bot; it’s the foundation of a <strong>personal finance agent</strong>.`
        },
        {
            type: 'text',
            className: 'future-intro',
            content: `Future directions include:`
        },
        {
          type: 'group',
          className: 'future-block',
          blocks: [
            {
              type: 'image',
              className: 'future-img mobile-dashboard-img',
              src: bookiebotFuture,
              alt: 'Mobile dashboard',
              caption: 'Mobile dashboard with custom Google Sheet templates'
            },
            {
              type: 'image',
              className: 'future-img multi-user-img',
              src: multiUser,
              alt: 'Multi-user mode',
              caption: 'Authenticated multi-user mode'
            },
            {
              type: 'image',
              className: 'future-img visual-insights-img',
              src: visualGPTsummaries,
              alt: 'Visual insights',
              caption: 'Visual insights powered by GPT summaries'
            },
            {
              type: 'image',
              className: 'future-img error-handling-img',
              src: memoryErrorHandling,
              alt: 'Error handling & memory',
              caption: 'Fine-tuned error handling and conversation memory'
            }
          ]
        }
      ],      
  }
};

export default bookiebot;
