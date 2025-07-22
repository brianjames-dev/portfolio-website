import React from 'react';

// Import all your icons explicitly
import reactIcon from '../images/react.svg';
import awsIcon from '../images/AWS.svg';
import cplusplusIcon from '../images/cplusplus.svg';
import cssIcon from '../images/css.svg';
import downloadIcon from '../images/download.svg';
import expressIcon from '../images/express.svg';
import flaskIcon from '../images/flask.svg';
import gitIcon from '../images/git.svg';
import githubIcon from '../images/github.svg';
import htmlIcon from '../images/html.svg';
import instagramIcon from '../images/instagram.svg';
import javaIcon from '../images/java.svg';
import javascriptIcon from '../images/javascript.svg';
import linkedinIcon from '../images/linkedin.svg';
import mariadbIcon from '../images/mariadb.svg';
import matplotlibIcon from '../images/matplotlib.svg';
import menuIcon from '../images/menu.svg';
import mongodbIcon from '../images/mongodb.svg';
import nodejsIcon from '../images/nodejs.svg';
import numpyIcon from '../images/numpy.svg';
import pandasIcon from '../images/pandas.svg';
import powerbiIcon from '../images/powerbi.svg';
import pythonIcon from '../images/python.svg';
import sqliteIcon from '../images/sqlite.svg';
import scikitlearnIcon from '../images/scikitlearn.svg';
import seabornIcon from '../images/seaborn.svg';
import closeIcon from '../images/close.svg';
import discordIcon from '../images/discord.svg';

function Projects() {
  const iconMap = {
    'React': reactIcon,
    'AWS': awsIcon,
    'C++': cplusplusIcon,
    'CPlusPlus': cplusplusIcon,
    'CSS': cssIcon,
    'HTML': htmlIcon,
    'JavaScript': javascriptIcon,
    'Node.js': nodejsIcon,
    'Node': nodejsIcon,
    'MongoDB': mongodbIcon,
    'SQLite': sqliteIcon,
    'Flask': flaskIcon,
    'Python': pythonIcon,
    'Git': gitIcon,
    'GitHub': githubIcon,
    'Java': javaIcon,
    'LinkedIn': linkedinIcon,
    'MariaDB': mariadbIcon,
    'Matplotlib': matplotlibIcon,
    'Menu': menuIcon,
    'NumPy': numpyIcon,
    'Pandas': pandasIcon,
    'Power BI': powerbiIcon,
    'Scikit-learn': scikitlearnIcon,
    'Seaborn': seabornIcon,
    'Instagram': instagramIcon,
    'Close': closeIcon,
    'Download': downloadIcon,
    'Express.js': expressIcon,
    'Discord.py': discordIcon,
  }

  const projects = [
    {
      title: 'Serverless Portfolio & Contact Form',
      description:
        'Personal portfolio website with a serverless architecture: React frontend deployed on CloudFront and S3, integrated with a cloud-native contact form powered by AWS Lambda, S3, and SES for email delivery.',
      stack: ['React', 'JavaScript', 'AWS Lambda', 'S3', 'SES', 'CloudFront', 'HTML', 'CSS'],
    },
    {
      title: 'BookieBot',
      description:
        'Autonomous AI finance chatbot that lets users log, query, and visualize expenses with natural language. Supports multi-user workflows, role-based access, and over 30 analytics intents.',
      stack: ['Python', 'Discord.py', 'OpenAI API', 'Google Sheets API', 'Railway'],
      github: 'https://github.com/brianjames-dev/bookiebot',
    },
    {
      title: 'SkinPro',
      description:
        'Full-stack desktop app for spa operations: manages 300+ client records and 2,000+ appointments, with QR-based mobile photo uploads, PDF prescription generator, and responsive Tkinter UI. Saved 1,000+ hours/year and $3,000+ in costs.',
      stack: ['Python', 'SQLite', 'Flask', 'Tkinter', 'ReportLab', 'PIL'],
      github: 'https://github.com/brianjames-dev/SkinPro',
    },
    {
      title: 'NES Emulator',
      description:
        'Cycle-accurate NES emulator (APU + CPU) with >95% test coverage and platform-specific bug fixes. Led development of Trello/Discord-driven team and delivered cross-platform support.',
      stack: ['C++', 'SDL2', 'Dear ImGUI'],
      github: 'https://github.com/brianjames-dev/OSUcapstone',
    },
    {
      title: 'Task Checklist',
      description:
        'Full-stack MERN web app with CRUD functionality and user-friendly React components, backed by a Node/Express/MongoDB stack.',
      stack: ['JavaScript', 'MongoDB', 'Express.js', 'React', 'Node.js', 'HTML', 'CSS'],
      github: 'https://github.com/brianjames-dev/Full-stack-Website-MERN',
    },
  ];

  const renderTag = (tech, i) => {
    const iconSrc = iconMap[tech];
    return (
      <span key={i} className={`tag ${!iconSrc ? 'no-icon' : ''}`}>
        {iconSrc && (
          <span className="tag-icon-container">
            <img src={iconSrc} alt={tech} className="tag-icon" />
          </span>
        )}
        {tech}
      </span>
    );
  };
  
  
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Projects</h2>
        {projects.map((proj, idx) => (
          <div key={idx} className="project-card">
            <div className="project-header">
              <h3>{proj.title}</h3>
              <a href={proj.github} target="_blank" rel="noopener noreferrer">
                <img src={githubIcon} alt="GitHub" className="github-link-icon" />
              </a>
            </div>
            <div className="project-stack">
              {proj.stack.flatMap((tech, i) => {
                return renderTag(tech, i);
              })}

            </div>
            <p className="project-description">{proj.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
