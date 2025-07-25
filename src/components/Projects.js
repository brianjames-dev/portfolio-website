import React, { useState, useEffect } from 'react';
import { scrollToId } from '../utils/scrollToId';

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
import downArrowIcon from '../images/down_arrows.svg';
import upArrowIcon from '../images/up_arrows.svg';

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

const iconMap = {
  'React': reactIcon,
  'AWS': awsIcon,
  'C++': cplusplusIcon,
  'CPlusPlus': cplusplusIcon,
  'CSS': cssIcon,
  'HTML': htmlIcon,
  'JavaScript': javascriptIcon,
  'Node.js': nodejsIcon,
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


function Projects() {
  const [expandedProjectIndex, setExpandedProjectIndex] = useState(null);
  const [pendingGalleryIndex, setPendingGalleryIndex] = useState(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [fullscreenImages, setFullscreenImages] = useState([]);

  const toggleGallery = (index) => {
    if (expandedProjectIndex !== null && expandedProjectIndex !== index) {
      setExpandedProjectIndex(null);
      setPendingGalleryIndex(index);
    } else {
      setExpandedProjectIndex(prev => (prev === index ? null : index));
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setFullscreenIndex(null);
        setFullscreenImages([]);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (expandedProjectIndex === null && pendingGalleryIndex !== null) {
      setTimeout(() => {
        scrollToId(`project-${projects[pendingGalleryIndex].title.replace(/\s+/g, '-')}`);
        setExpandedProjectIndex(pendingGalleryIndex);
        setPendingGalleryIndex(null);
      }, 0);
    }
  }, [expandedProjectIndex, pendingGalleryIndex]);

  // preload adjacent images
  useEffect(() => {
    if (fullscreenIndex !== null) {
      const preload = (idx) => {
        if (fullscreenImages[idx]) {
          const img = new Image();
          img.src = fullscreenImages[idx].src;
        }
      };
      preload(fullscreenIndex + 1);
      preload(fullscreenIndex - 1);
    }
  }, [fullscreenIndex, fullscreenImages]);

  // mobile swipe gesture support
  useEffect(() => {
    const overlay = document.querySelector('.fullscreen-overlay');
    if (!overlay) return;

    let startX = null;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      if (!startX) return;
      const deltaX = e.touches[0].clientX - startX;
      if (deltaX > 80 && fullscreenIndex > 0) {
        setFullscreenIndex((prev) => prev - 1);
        startX = null;
      } else if (deltaX < -80 && fullscreenIndex < fullscreenImages.length - 1) {
        setFullscreenIndex((prev) => prev + 1);
        startX = null;
      }
    };

    overlay.addEventListener('touchstart', handleTouchStart, { passive: true });
    overlay.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      overlay.removeEventListener('touchstart', handleTouchStart);
      overlay.removeEventListener('touchmove', handleTouchMove);
    };
  }, [fullscreenIndex, fullscreenImages]);


  const projects = [
    {
      title: 'Serverless Portfolio',
      team: 'Solo',
      description:
        'Personal portfolio website with a serverless architecture: React frontend deployed on CloudFront and S3, integrated with a cloud-native contact form powered by AWS Lambda, S3, and SES for email delivery.',
      stack: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'AWS', 'S3', 'CloudFront'],
      github: 'https://github.com/brianjames-dev/portfolio-website',
    },
    {
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
      ]
    },
    {
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
      ]
    },
    {
      title: 'NES Emulator',
      team: '5-person Team',
      description:
        'Cycle-accurate NES emulator (APU + CPU) with >95% test coverage and platform-specific bug fixes. Led development of Trello/Discord-driven team and delivered cross-platform support.',
      stack: ['C++', 'Git', 'SDL2', 'Dear ImGUI'],
      github: 'https://github.com/brianjames-dev/OSUcapstone',
    },
    {
      title: 'Task Checklist',
      team: 'Solo',
      description:
        'Full-stack MERN web app with CRUD functionality and user-friendly React components, backed by a Node/Express/MongoDB stack.',
      stack: ['React', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'HTML', 'CSS'],
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
    <section id="projects" className="projects" data-snap-target>
      <div className="container">
        <h2>Projects</h2>
        {projects.map((proj, idx) => (
          <div key={idx} className="project-card" id={`project-${proj.title.replace(/\s+/g, '-')}`}>
            <div className="project-header">
              <h3 className="title">{proj.title}</h3>
              <a
                className="githubIcon"
                href={proj.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={githubIcon} alt="GitHub" className="github-link-icon" />
              </a>
            </div>

            <div className="project-subheader">
              <p>{proj.team}</p>
            </div>

            <div className="project-stack">
              {proj.stack.map((tech, i) => renderTag(tech, i))}
            </div>

            <hr className="project-divider" />

            <p className="project-description">{proj.description}</p>

            {proj.images && proj.images.length > 0 && (
              <>
                <button
                  className="gallery-toggle-btn"
                  onClick={() => toggleGallery(idx)}
                >
                  {expandedProjectIndex === idx ? 'Hide Gallery' : 'Show Gallery'}
                  <img
                    src={expandedProjectIndex === idx ? upArrowIcon : downArrowIcon}
                    alt={expandedProjectIndex === idx ? 'Collapse' : 'Expand'}
                    className="arrow-icon"
                  />
                </button>
                {expandedProjectIndex === idx && (
                  <>
                    <div className="project-gallery">
                      {proj.images.map((img, i) => (
                        <div className="gallery-item" key={i}>
                          <img
                            loading="lazy"
                            src={img.src}
                            alt={img.caption || `Screenshot ${i + 1}`}
                            className="clickable-gallery-image"
                            onClick={() => {
                              setFullscreenImages(proj.images);
                              setFullscreenIndex(i);
                            }}
                          />
                          {img.caption && <p>{img.caption}</p>}
                        </div>
                      ))}
                    </div>

                    <button
                      className="gallery-toggle-btn"
                      onClick={() => {
                        toggleGallery(idx);
                        setTimeout(() => scrollToId(`project-${proj.title.replace(/\s+/g, '-')}`), 0);
                      }}
                    >
                      Hide Gallery
                      <img
                        src={upArrowIcon}
                        alt="Collapse"
                        className="arrow-icon"
                      />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {fullscreenIndex !== null && (
        <div
          className="fullscreen-overlay visible"
          onClick={() => {
            setFullscreenIndex(null);
            setFullscreenImages([]);
          }}
        >
          <img
            loading="lazy"
            src={fullscreenImages[fullscreenIndex]?.src}
            alt={fullscreenImages[fullscreenIndex]?.caption || "Fullscreen"}
            className="fullscreen-image"
          />

          {/* Caption */}
          {fullscreenImages[fullscreenIndex]?.caption && (
            <p className="fullscreen-caption">
              {fullscreenImages[fullscreenIndex].caption}
            </p>
          )}

          {/* Close Button */}
          <button
            className="fullscreen-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenIndex(null);
              setFullscreenImages([]);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img src={closeIcon} alt="Close" />
          </button>

          {/* Arrows */}
          {fullscreenIndex > 0 && (
            <button
              className="carousel-arrow left"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIndex((prev) => prev - 1);
              }}
            >
              <span className="arrow-inner">‹</span>
            </button>
          )}
          {fullscreenIndex < fullscreenImages.length - 1 && (
            <button
              className="carousel-arrow right"
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenIndex((prev) => prev + 1);
              }}
            >
              <span className="arrow-inner">›</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default Projects;
