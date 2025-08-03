// /data/projects.js

// Import all project images
import bookiebot1 from '../images/bookiebot_imgs/bookiebot-icon.png';
import bookiebot2 from '../images/bookiebot_imgs/intent-list-1.png';
import bookiebot3 from '../images/bookiebot_imgs/intent-list-2.png';
import bookiebot4 from '../images/bookiebot_imgs/intent-desc+example.png';
import bookiebot5 from '../images/bookiebot_imgs/expense-breakdown.png';
import bookiebot6 from '../images/bookiebot_imgs/spending-calendar.png';
import bookiebot7 from '../images/bookiebot_imgs/specific-day-expenses.png';
import bookiebot8 from '../images/bookiebot_imgs/logged-food-expense.png';
import bookiebot9 from '../images/bookiebot_imgs/expense-sheet-proof.png';

import skinpro1 from '../images/skinpro_imgs/splash_screen.jpg';
import skinpro2 from '../images/skinpro_imgs/client_tab.jpg';
import skinpro3 from '../images/skinpro_imgs/info_tab.jpg';
import skinpro4 from '../images/skinpro_imgs/appt_tab.jpg';
import skinpro5 from '../images/skinpro_imgs/photos_tab_blur.jpg';
import skinpro6 from '../images/skinpro_imgs/QR_upload.jpg';
import skinpro7 from '../images/skinpro_imgs/Upload_Photos.jpeg';
import skinpro8 from '../images/skinpro_imgs/Upload_Complete.jpeg';
import skinpro9 from '../images/skinpro_imgs/rx_tab.jpg';
import skinpro10 from '../images/skinpro_imgs/rx_generator.jpg';
import skinpro11 from '../images/skinpro_imgs/rx_preview.jpg';
import skinpro12 from '../images/skinpro_imgs/alerts_tab.jpg';

const projects = [
    {
      id: 'portfolio',
      title: 'Serverless Portfolio',
      team: 'Solo',
      description:
        'Personal portfolio website with a serverless architecture: React frontend deployed on CloudFront and S3, integrated with a cloud-native contact form powered by AWS Lambda, S3, and SES for email delivery.',
      stack: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'AWS', 'S3', 'CloudFront', 'SES', 'AWS Lambda'],
      github: 'https://github.com/brianjames-dev/portfolio-website',
      images: [],
    },

    {
      id: 'bookiebot',
      title: 'BookieBot',
      team: 'Solo',
      description:
        'BookieBot is an autonomous AI finance chatbot that allows users to log, query, and visualize their expenses with natural language and supports multi-user workflows, role-based access, and over 30 analytics intents.',
      stack: ['Python', 'Discord.py', 'Git', 'OpenAI API', 'Google Sheets API', 'Railway'],
      github: 'https://github.com/brianjames-dev/bookiebot',
      images: [
        { src: bookiebot1, caption: 'BookieBot Discord Profile Pic' },
        { src: bookiebot2, caption: 'Intent Recognition – Page 1' },
        { src: bookiebot3, caption: 'Intent Recognition – Page 2' },
        { src: bookiebot4, caption: 'Intent Description + Sample Query' },
        { src: bookiebot5, caption: 'Expense Breakdown' },
        { src: bookiebot6, caption: 'Spending Calendar View' },
        { src: bookiebot7, caption: 'Expenses on a Specific Day' },
        { src: bookiebot8, caption: 'Food Log Snapshot' },
        { src: bookiebot9, caption: 'Autonomous Logging' },
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

        description: `
          BookieBot is an <strong>autonomous AI finance chatbot</strong> that allows users to log, query, and visualize their expenses with <strong>natural language</strong> and supports <strong>multi-user workflows, role-based access, and over thirty analytics intents</strong>.
        `,
        
        background: `
          BookieBot began as a solution for a personal problem: my partner and I tracked our shared expenses using a custom Google Sheets budget, but logging purchases meant stopping what we were doing, switching tabs, finding the right row, and formatting everything correctly — a small but constant friction that made budgeting feel like a chore, which meant we didn’t do it. BookieBot was born out of our need for a simple, user-friendly solution to allow expense input to become simpler.
        `,
      
        challenge: `
        We didn’t have a logging problem — we had <strong>a convenience problem</strong>.
        Even though we were motivated to budget together, the workflow wasn’t compatible with daily life. In moments when we were busy or distracted — grabbing coffee, getting groceries — we’d forget to log things, lose receipts, and the data would slowly drift further away from cohesive and correct. To keep things simple in the beginning, my partner would drop a message into our shared Discord with the amount and item of their purchase, which I would gradually enter into the shared spreadsheet. At a certain point, I realized I was working harder, and not smarter. What if budgeting was as simple as chatting?
        `,
      
        goal: `
          Build a personal finance tool that could remain <strong>simple, accessible, and truly frictionless</strong>. I wanted the bot to do the following:
          - Understand natural language commands
          - Log expenses automatically into Google Sheets with accurate information
          - Live inside a space we already used: Discord
        `,
      
        research: `
        Most existing solutions (YNAB, Mint, Notion templates) were either too rigid or required dedicated UI interaction. I didn’t want an additional learning curve for either of us. I realized that a <strong>GPT-powered Discord bot</strong> could act as the "interface" — something we could message naturally and forget about. I wanted the bot to <strong>accept normal dialogue</strong> for quick use (e.g., $12 sushi) and for each user to get immediate confirmation. Mostly, I wanted to not have to touch the spreadsheet at all other than to review at the end of the month, and to <strong>easily tune behaviors by updating the prompt</strong> rather than rewriting code. 
        `,
      
        architecture: `
        `,
      
        features: [
          {
            title: '🗣️ Natural Language Logging',
            content: 'Messages like "Target 18.43 groceries" are interpreted by GPT, categorized, and converted to JSON.'
          },
          {
            title: '🧠 LLM-as-a-Translator',
            content: 'Instead of hard-coded commands, GPT handles linguistic flexibility.'
          },
          {
            title: '📊 Google Sheets Sync',
            content: 'Each expense is logged into a clean, timestamped row in our shared Google Sheet — no human editing required.'
          },
          {
            title: '⚡ Fast & Async',
            content: 'Thanks to asyncio, responses are snappy and never block on API calls or logging.'
          }
        ],
      
        impact: `
          BookieBot changed how we interact with our finances:
          - Reduced expense logging time from 5+ steps to 1, making budgeting feel automatic, which encouraged consistent use for all users
          - Enabled experimentation with multi-user flows and analytics intents
        `,
      
        reflection: `
          BookieBot taught me what practical LLM integration looks like, and showed me that the <strong>best tools often feel invisible</strong> and leave users with an easy, immediate solution to a practical problem. Creating BookieBot taught me:
          - How to structure prompts for reliability
          - Where LLMs outperform traditional parsers
          - How async design creates responsiveness
        
        `,
      
        future: `
        BookieBot is still evolving. It’s not just a bot; it’s the foundation of a <strong>personal finance agent</strong>. Future directions include:
        - Mobile dashboard with custom Google Sheet templates
        - Authenticated multi-user mode
        - Visual insights powered by GPT summaries
        - Fine-tuned error handling and conversation memory
        `
      }      
    },
    
    {
      id: 'skinpro',
      title: 'SkinPro',
      team: 'Contractual',
      description:
        'Full-stack desktop app for spa operations: manages 300+ client records and 2,000+ appointments, with QR-based mobile photo uploads, PDF prescription generator, and responsive Tkinter UI. Saved 1,000+ hours/year and $3,000+ in costs.',
      stack: ['Python', 'SQLite', 'Flask', 'HTML', 'CSS', 'Git', 'Tkinter', 'ReportLab'],
      github: 'https://github.com/brianjames-dev/SkinPro',
      images: [
        { src: skinpro1, caption: '🚪 Splash Screen' },
        { src: skinpro2, caption: '👩 Clients Tab' },
        { src: skinpro3, caption: '📝 Info Tab (Client Demographics & History)' },
        { src: skinpro4, caption: '📅 Appointments Tab' },
        { src: skinpro5, caption: '📷 Photos Tab (Before & After Comparison)' },
        { src: skinpro6, caption: '📲 QR Upload Window' },
        { src: skinpro7, caption: '📲 Upload In Progress' },
        { src: skinpro8, caption: '📲 Upload Complete' },
        { src: skinpro9, caption: '💊 Prescriptions Tab' },
        { src: skinpro10, caption: '🧾 Prescription Generator (Dynamic Form)' },
        { src: skinpro11, caption: '🖨️ Finished Prescription Preview (Printable)' },
        { src: skinpro12, caption: '🔔 Alerts Tab (Follow-up Reminders)' },
      ],
      expanded: {
        title: `
          SkinPro - Fullstack Desktop Application/Database
        `,

        subtitle: `
          Contractual Project - Apotheca Day Spa
        `,

        github: `
          https://github.com/brianjames-dev/SkinPro
        `,

        description: `
          Full-stack desktop app for spa operations: manages 300+ client records and 2,000+ appointments, with QR-based mobile photo uploads, PDF prescription generator, and responsive Tkinter UI. Saved 1,000+ hours/year and $3,000+ in costs.
        `,
      }
    },

    {
      id: 'nes-emulator',
      title: 'NES Emulator',
      team: '5-person Team',
      description:
        'Cycle-accurate NES emulator (APU + CPU) with >95% test coverage and platform-specific bug fixes. Led development of Trello/Discord-driven team and delivered cross-platform support.',
      stack: ['C++', 'Git', 'SDL2', 'Dear ImGUI'],
      github: 'https://github.com/brianjames-dev/OSUcapstone',
      images: [],
    },
    
    {
      id: 'task-checklist',
      title: 'Task Checklist',
      team: 'Solo',
      description:
        'Full-stack MERN web app with CRUD functionality and user-friendly React components, backed by a Node/Express/MongoDB stack.',
      stack: ['React', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS'],
      github: 'https://github.com/brianjames-dev/Full-stack-Website-MERN',
      images: [],
    },
  ];
  
  export default projects;