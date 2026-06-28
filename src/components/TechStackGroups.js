import { useMemo, useState } from "react";
import { renderTag } from "../utils/renderTag";

const CATEGORY_ORDER = [
  "AI",
  "Backend",
  "Data",
  "Frontend",
  "Cloud",
  "Tools",
  "Other",
];

const CATEGORY_MAP = {
  ".NET": "Backend",
  "APNs / FCM": "Cloud",
  "AWS": "Cloud",
  "AWS Lambda": "Cloud",
  "AI Systems": "AI",
  "Azure OpenAI": "AI",
  "C#": "Backend",
  "C++": "Backend",
  "CSS": "Frontend",
  "CloudFront": "Cloud",
  "Codex": "AI",
  "Dear ImGUI": "Frontend",
  "Developer Tools": "Tools",
  "Discord.py": "Backend",
  "Docker": "Tools",
  "Express.js": "Backend",
  "FastAPI": "Backend",
  "Firebase": "Cloud",
  "Firestore": "Data",
  "Flask": "Backend",
  "GCP": "Cloud",
  "Git": "Tools",
  "Google Ads": "Cloud",
  "Google Sheets API": "Cloud",
  "HTML": "Frontend",
  "JavaScript": "Frontend",
  "LangGraph": "AI",
  "Logic Pro X": "Tools",
  "Microsoft SQL Server": "Data",
  "MongoDB": "Data",
  "NextJS": "Frontend",
  "Node.js": "Backend",
  "OpenAI API": "AI",
  "PDFKit": "Backend",
  "Pandas": "Data",
  "Playwright": "Tools",
  "PostgreSQL": "Data",
  "Prompt Engineering": "AI",
  "Pydantic": "Backend",
  "Python": "Backend",
  "RAG": "AI",
  "REST API": "Backend",
  "Railway": "Cloud",
  "React": "Frontend",
  "Redis": "Data",
  "Replit": "Tools",
  "S3": "Cloud",
  "SDL2": "Frontend",
  "SES": "Cloud",
  "SQL": "Data",
  "SQLAlchemy": "Data",
  "SQLite": "Data",
  "SerpAPI": "Cloud",
  "Showbuddy": "Tools",
  "Software Engineering": "Backend",
  "Swift": "Frontend",
  "TypeScript": "Frontend",
  "VS 2022": "Tools",
  "Xcode": "Tools",
  "XML": "Data",
};

const FEATURED_TAG_LIMIT = 5;
const MIN_HIDDEN_TAGS = 2;

const FEATURED_PRIORITY = [
  "LangGraph",
  "Azure OpenAI",
  "OpenAI API",
  "RAG",
  "FastAPI",
  "Python",
  ".NET",
  "C#",
  "TypeScript",
  "React",
  "NextJS",
  "Swift",
  "SQL",
  "PostgreSQL",
  "SQLite",
  "Google Sheets API",
  "Discord.py",
  "AWS",
  "GCP",
  "Docker",
  "Git",
];

function groupStack(stack = []) {
  const grouped = CATEGORY_ORDER.map((label) => ({
    label,
    items: [],
  }));
  const groupByLabel = new Map(grouped.map((group) => [group.label, group]));

  stack.forEach((tech) => {
    const category = CATEGORY_MAP[tech] || "Other";
    groupByLabel.get(category).items.push(tech);
  });

  return grouped.filter((group) => group.items.length > 0);
}

function getVisibleGroups(groups, showAll) {
  return showAll ? groups : [];
}

function getFeaturedLimit(stack) {
  if (stack.length <= FEATURED_TAG_LIMIT) return stack.length;
  return Math.max(
    1,
    Math.min(FEATURED_TAG_LIMIT, stack.length - MIN_HIDDEN_TAGS)
  );
}

function getFeaturedStack(stack = []) {
  const priorityByTech = new Map(
    FEATURED_PRIORITY.map((tech, priority) => [tech, priority])
  );
  const featuredLimit = getFeaturedLimit(stack);

  return [...stack]
    .sort((a, b) => {
      const priorityA = priorityByTech.get(a) ?? Number.MAX_SAFE_INTEGER;
      const priorityB = priorityByTech.get(b) ?? Number.MAX_SAFE_INTEGER;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return stack.indexOf(a) - stack.indexOf(b);
    })
    .slice(0, featuredLimit);
}

export default function TechStackGroups({ stack = [] }) {
  const [showAll, setShowAll] = useState(false);
  const groups = useMemo(() => groupStack(stack), [stack]);
  const featuredStack = useMemo(() => getFeaturedStack(stack), [stack]);
  const visibleGroups = useMemo(
    () => getVisibleGroups(groups, showAll),
    [groups, showAll]
  );
  const hiddenCount = Math.max(0, stack.length - featuredStack.length);

  if (!stack.length) return null;

  return (
    <div className="project-stack" aria-label="Technology stack">
      {!showAll && (
        <div className="stack-featured-row">
          {featuredStack.map((tech, i) =>
            renderTag(tech, `featured-${tech}-${i}`)
          )}
          {hiddenCount > 0 && (
            <button
              className="stack-more-toggle stack-more-toggle--inline"
              type="button"
              aria-expanded={showAll}
              onClick={(event) => {
                event.stopPropagation();
                setShowAll(true);
              }}
            >
              +{hiddenCount} more
            </button>
          )}
        </div>
      )}
      {showAll &&
        visibleGroups.map((group) => (
          <div className="stack-group" key={group.label}>
            <span className="stack-group-label">{group.label}</span>
            <div className="stack-tag-row">
              {group.items.map((tech, i) =>
                renderTag(tech, `${group.label}-${tech}-${i}`)
              )}
            </div>
          </div>
        ))}
      {showAll && hiddenCount > 0 && (
        <button
          className="stack-more-toggle"
          type="button"
          aria-expanded={showAll}
          onClick={(event) => {
            event.stopPropagation();
            setShowAll((current) => !current);
          }}
        >
          {showAll ? "Show less" : `+${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
