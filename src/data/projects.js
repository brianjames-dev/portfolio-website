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
        'Autonomous AI finance chatbot that lets users log, query, and visualize expenses with natural language. Supports multi-user workflows, role-based access, and over 30 analytics intents.',
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
        subtitle: 'LLM-powered Discord agent for seamless budget tracking',
        heroMedia: [
          bookiebot2,
          bookiebot5,
          bookiebot6,
        ],
        problem: `
          BookieBot was born out of a personal need: my girlfriend and I wanted a fast, natural way to track spending without disrupting our day.
          Traditional spreadsheets worked well for organizing data *after the fact*, but logging purchases in the moment required too many clicks, tabs, and copy-pastes.
          The core goal? Remove friction between making a purchase and recording it correctly — turning budgeting into a habit, not a hassle.
        `,
        tools: [
          'Python',
          'Discord.py',
          'OpenAI API',
          'Google Sheets API',
          'Railway (Hosting)',
          'Fully async architecture with asyncio'
        ],
        features: [
          {
            title: '🗣️ Natural Language Expense Logging',
            content: `BookieBot accepts everyday messages like “Starbucks 6.45 breakfast” and parses them into structured data entries. 
            It intelligently identifies the category, amount, and merchant using GPT-powered parsing.`
          },
          {
            title: '🧠 LLM-as-a-Translator',
            content: `Instead of traditional input forms, BookieBot uses OpenAI’s language model to translate messy input into clean JSON. 
            This unlocked flexibility: new commands didn’t require code rewrites — just better prompt design.`
          },
          {
            title: '📊 Google Sheets Integration',
            content: `Each entry is logged directly to our personalized Google Sheets budget. 
            For future versions, this system can be expanded to generate templated sheets per user.`
          },
          {
            title: '⚡ Full Async Performance',
            content: `The bot runs fully asynchronously, allowing it to quickly process incoming messages, call the OpenAI API, 
            and follow up with confirmation — without blocking or delays.`
          }
        ],
        polish: `
          - Designed for clean, contextual responses inside Discord — no command syntax to memorize  
          - Error-tolerant: if parsing fails, the bot politely asks for clarification  
          - Highly maintainable: prompt-based architecture makes it easy to tune behavior without changing code  
          - Optimized for daily use: fast responses, smart defaults, and minimal effort required
        `,
        reflection: `
          BookieBot was a huge step forward in learning real-world LLM integration — not just for fun, but for solving a practical, recurring pain point.
          It changed how I think about building tools: sometimes the best UI is the one you don’t have to learn.
          If I had more time, I’d package it into a mobile app with user-authenticated Google Sheet syncing and visual dashboards.
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