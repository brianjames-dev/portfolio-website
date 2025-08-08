// /data/projects/skinpro.js

// Import all project images
import skinpro1 from '../../images/skinpro_imgs/splash_screen.jpg';
import skinpro2 from '../../images/skinpro_imgs/client_tab.jpg';
import skinpro3 from '../../images/skinpro_imgs/info_tab.jpg';
import skinpro4 from '../../images/skinpro_imgs/appt_tab.jpg';
import skinpro5 from '../../images/skinpro_imgs/photos_tab_blur.jpg';
import skinpro6 from '../../images/skinpro_imgs/QR_upload.jpg';
import skinpro7 from '../../images/skinpro_imgs/Upload_Photos.jpeg';
import skinpro8 from '../../images/skinpro_imgs/Upload_Complete.jpeg';
import skinpro9 from '../../images/skinpro_imgs/rx_tab.jpg';
import skinpro10 from '../../images/skinpro_imgs/rx_generator.jpg';
import skinpro11 from '../../images/skinpro_imgs/rx_preview.jpg';
import skinpro12 from '../../images/skinpro_imgs/alerts_tab.jpg';

const skinpro = {
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
};

export default skinpro;