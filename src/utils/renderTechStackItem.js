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
      {icon && <img src={icon} alt={tech} className="tech-icon" />}
      <div className="tech-description">
        <strong>{tech}</strong>: {purpose}
      </div>
    </div>
  );
}
