// /utils/renderTechStackItem.js
import iconMap from '../data/iconMap';

const purposeMap = {
  'Python': 'Core language for logic and async architecture',
  'Discord.py': 'Real-time messaging via Discord integration',
  'Git': 'Version control and collaboration',
  'OpenAI API': 'LLM parsing of natural language input',
  'Google Sheets API': 'Expense logging to cloud spreadsheet',
  'Railway': 'Scalable deployment and hosting',
};

export function renderTechStackItem(tech, i) {
    const icon = iconMap[tech];
    const purpose = purposeMap[tech] || 'Used in project';
  
    return (
      <div key={i} className="tech-stack-item">
        <div className="tech-tag" title={tech}>
          {icon && <img src={icon} alt={tech} className="tech-icon" />}
          <span className="tech-name">{tech}</span>
        </div>
        <p className="tech-purpose">{purpose}</p>
      </div>
    );
  }
  
