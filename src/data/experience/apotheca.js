// /data/experience/apotheca.js

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

const apotheca = {
    id: 'apotheca',
    title: 'Full-stack Developer',
    team: 'Apotheca | Remote | Part-time',
    description:
        'Design, maintain, and evolve the SkinPro desktop application in collaboration with the business owner, managing 300+ client records and 2,000+ appointments, saving 1,000+ hours/year of manual work and $3,000+ in software costs.',
    stack: ['Python', 'SQLite', 'Flask', 'HTML', 'CSS', 'Git', 'Tkinter', 'ReportLab'],
    github: '',
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
            Full-stack Developer
        `,

        subtitle: `
            Apotheca | Remote | Part-time
        `,

        github: `
        
        `,

        description: `
            •  Design, maintain, and evolve the SkinPro desktop application [Github] in collaboration with the business owner, managing 300+ client records and 2,000+ appointments, saving 1,000+ hours/year of manual work and $3,000+ in software costs.
            •  Integrated a QR-based mobile-to-desktop photo upload system and a dynamic PDF prescription generator—reducing photo management time by 90% and supporting customizable care routines.
            •  Built modern, responsive UIs with CTkinter and a local SQLite database with weekly backups, saving $500+ per year on cloud costs.
        `,
    }
};

export default apotheca;