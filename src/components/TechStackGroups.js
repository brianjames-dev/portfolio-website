import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
const STACK_TOGGLE_DURATION = 0.5;
const STACK_TOGGLE_EASE = [0.4, 0, 0.2, 1];

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
  const shouldReduceMotion = useReducedMotion();
  const groups = useMemo(() => groupStack(stack), [stack]);
  const featuredStack = useMemo(() => getFeaturedStack(stack), [stack]);
  const visibleGroups = useMemo(
    () => getVisibleGroups(groups, showAll),
    [groups, showAll]
  );
  const hiddenCount = Math.max(0, stack.length - featuredStack.length);

  if (!stack.length) return null;

  const revealTransition = {
    duration: shouldReduceMotion ? 0 : STACK_TOGGLE_DURATION,
    ease: STACK_TOGGLE_EASE,
  };

  return (
    <div className="project-stack" aria-label="Technology stack">
      <AnimatePresence initial={false} mode="popLayout">
        {!showAll && (
          <motion.div
            className="stack-featured-row"
            key="featured-stack"
            layout
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={revealTransition}
          >
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
          </motion.div>
        )}

        {showAll && (
          <motion.div
            className="stack-expanded-groups"
            key="expanded-stack"
            layout
            initial={
              shouldReduceMotion ? false : { opacity: 0, y: 10, height: 0 }
            }
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, height: 0 }
            }
            transition={revealTransition}
          >
            {visibleGroups.map((group, groupIndex) => (
              <motion.div
                className="stack-group"
                key={group.label}
                layout
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...revealTransition,
                  delay: shouldReduceMotion ? 0 : groupIndex * 0.035,
                }}
              >
                <span className="stack-group-label">{group.label}</span>
                <div className="stack-tag-row">
                  {group.items.map((tech, i) =>
                    renderTag(tech, `${group.label}-${tech}-${i}`)
                  )}
                </div>
              </motion.div>
            ))}
            {hiddenCount > 0 && (
              <button
                className="stack-more-toggle"
                type="button"
                aria-expanded={showAll}
                onClick={(event) => {
                  event.stopPropagation();
                  setShowAll(false);
                }}
              >
                Show less
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
