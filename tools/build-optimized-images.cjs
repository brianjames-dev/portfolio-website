#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const publicOutputRoot = path.join(root, "public", "img", "optimized");
const generatedModulePath = path.join(
  root,
  "src",
  "data",
  "generated",
  "optimizedImages.js"
);

const variantProfiles = {
  galleryDisplay: {
    suffix: "display",
    width: 1400,
    height: 1400,
    quality: 76,
  },
  galleryZoom: {
    suffix: "zoom",
    width: 1800,
    height: 1800,
    quality: 78,
  },
  galleryThumb: {
    suffix: "thumb",
    width: 220,
    height: 160,
    quality: 66,
  },
  content: {
    suffix: "content",
    width: 760,
    height: 760,
    quality: 74,
  },
};

const groups = [
  {
    exportName: "bookiebotGalleryImages",
    type: "gallery",
    outputDir: "bookiebot/gallery",
    images: [
      ["intentList1", "intent-list-1", "src/data/projects/bookiebot/imgs/intent-list-1.png"],
      ["intentList2", "intent-list-2", "src/data/projects/bookiebot/imgs/intent-list-2.png"],
      [
        "intentDescExample",
        "intent-desc-example",
        "src/data/projects/bookiebot/imgs/intent-desc+example.png",
      ],
      ["expenseBreakdown", "expense-breakdown", "src/data/projects/bookiebot/imgs/expense-breakdown.png"],
      ["spendingCalendar", "spending-calendar", "src/data/projects/bookiebot/imgs/spending-calendar.png"],
      [
        "specificDayExpenses",
        "specific-day-expenses",
        "src/data/projects/bookiebot/imgs/specific-day-expenses.png",
      ],
      ["loggedFoodExpense", "logged-food-expense", "src/data/projects/bookiebot/imgs/logged-food-expense.png"],
      [
        "expenseSheetProof",
        "expense-sheet-proof",
        "src/data/projects/bookiebot/imgs/expense-sheet-proof.png",
      ],
      ["bookiebotIcon", "bookiebot-icon", "src/data/projects/bookiebot/imgs/bookiebot-icon.png"],
    ],
  },
  {
    exportName: "apothecaGalleryImages",
    type: "gallery",
    outputDir: "apotheca/gallery",
    images: [
      ["clientsTab", "clients-tab", "src/data/experience/apotheca/imgs/client_tab.jpeg"],
      ["infoTab", "info-tab", "src/data/experience/apotheca/imgs/info_tab.jpeg"],
      ["appointmentsTab", "appointments-tab", "src/data/experience/apotheca/imgs/appt_tab.jpeg"],
      ["photosTab", "photos-tab", "src/data/experience/apotheca/imgs/photos_tab_blur.jpeg"],
      ["qrUpload", "qr-upload", "src/data/experience/apotheca/imgs/QR_upload.jpeg"],
      ["uploadPhotos", "upload-photos", "src/data/experience/apotheca/imgs/Upload_Photos.jpeg"],
      ["uploadComplete", "upload-complete", "src/data/experience/apotheca/imgs/Upload_Complete.jpeg"],
      ["rxTab", "rx-tab", "src/data/experience/apotheca/imgs/rx_tab.jpeg"],
      ["rxGenerator", "rx-generator", "src/data/experience/apotheca/imgs/rx_generator.jpeg"],
      ["rxPreview", "rx-preview", "src/data/experience/apotheca/imgs/rx_preview.jpeg"],
      ["alertsTab", "alerts-tab", "src/data/experience/apotheca/imgs/alerts_tab.jpeg"],
    ],
  },
  {
    exportName: "bookiebotStoryboardImages",
    type: "content",
    outputDir: "bookiebot/storyboard",
    images: [
      ["steps5to1", "5steps-to-1", "src/data/projects/bookiebot/imgs/storyboard_imgs/5stepsTo1.png"],
      ["asyncArrows", "async-arrows", "src/data/projects/bookiebot/imgs/storyboard_imgs/async_arrows.png"],
      [
        "autoLogging",
        "automatic-logging",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/automatic_logging.png",
      ],
      [
        "bookiebotFuture",
        "bookiebot-future",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/bookiebot_future.png",
      ],
      [
        "bookiebotHero",
        "bookiebot-hero",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/bookiebot_hero.png",
      ],
      [
        "bookiebotInside",
        "bookiebot-inside",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/bookiebot_inside.png",
      ],
      ["brainCircuit", "brain-circuit", "src/data/projects/bookiebot/imgs/storyboard_imgs/brain_circuit.png"],
      ["easyBudgeting", "easy-budgeting", "src/data/projects/bookiebot/imgs/storyboard_imgs/easy_budgeting.png"],
      [
        "gptPowered",
        "gpt-powered-bookiebot",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/GPT_powered_bookiebot.png",
      ],
      [
        "gptCloudToJson",
        "gpt-cloud-to-json",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/GPTcloudToJson.png",
      ],
      [
        "increasedUsage",
        "increased-usage",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/increased_usage.png",
      ],
      [
        "lightningBookiebot",
        "lightning-bookiebot",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/lightning_bookiebot.png",
      ],
      ["llmOutperform", "llm-outperform", "src/data/projects/bookiebot/imgs/storyboard_imgs/llm_outperform.png"],
      [
        "memoryErrorHandling",
        "memory-error-handling",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/memory_error_handling.png",
      ],
      ["multiUser", "multi-user", "src/data/projects/bookiebot/imgs/storyboard_imgs/multi_user.png"],
      [
        "naturalLanguageLogging",
        "natural-language-logging",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/natural_language_logging.png",
      ],
      [
        "normalDialogueConfirmation",
        "normal-dialogue-confirmation",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/normal_dialogue_confirmation.png",
      ],
      [
        "structurePromptsReliable",
        "structure-prompts-reliable",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/structure_prompts_reliable.png",
      ],
      ["techStack", "tech-stack", "src/data/projects/bookiebot/imgs/storyboard_imgs/techstack.png"],
      [
        "understandingCmds",
        "understanding-cmds",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/understanding_cmds.png",
      ],
      [
        "visualGptSummaries",
        "visual-gpt-summaries",
        "src/data/projects/bookiebot/imgs/storyboard_imgs/visual_GPT_summaries.png",
      ],
    ],
  },
];

const moduleHeader = `// This file is generated by tools/build-optimized-images.cjs.\n// Do not edit paths by hand; update the image build script instead.\n\nconst asset = (path) => \`\${import.meta.env.BASE_URL}\${path}\`;\n\n`;

const toPublicPath = (...segments) =>
  ["img", "optimized", ...segments].join("/");

const writeVariant = async (source, output, profile) => {
  await fs.mkdir(path.dirname(output), { recursive: true });

  await sharp(source)
    .rotate()
    .resize({
      width: profile.width,
      height: profile.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: profile.quality, effort: 5 })
    .toFile(output);
};

const buildGalleryEntry = async (group, key, slug, sourcePath) => {
  const source = path.join(root, sourcePath);
  const outputBase = path.join(publicOutputRoot, group.outputDir);

  const displayFile = `${slug}-${variantProfiles.galleryDisplay.suffix}.webp`;
  const zoomFile = `${slug}-${variantProfiles.galleryZoom.suffix}.webp`;
  const thumbFile = `${slug}-${variantProfiles.galleryThumb.suffix}.webp`;

  await Promise.all([
    writeVariant(source, path.join(outputBase, displayFile), variantProfiles.galleryDisplay),
    writeVariant(source, path.join(outputBase, zoomFile), variantProfiles.galleryZoom),
    writeVariant(source, path.join(outputBase, thumbFile), variantProfiles.galleryThumb),
  ]);

  const publicDir = group.outputDir.split(path.sep).join("/");
  return [
    `  ${key}: {`,
    `    src: asset("${toPublicPath(publicDir, zoomFile)}"),`,
    `    displaySrc: asset("${toPublicPath(publicDir, displayFile)}"),`,
    `    zoomSrc: asset("${toPublicPath(publicDir, zoomFile)}"),`,
    `    thumbnailSrc: asset("${toPublicPath(publicDir, thumbFile)}"),`,
    "  },",
  ].join("\n");
};

const buildContentEntry = async (group, key, slug, sourcePath) => {
  const source = path.join(root, sourcePath);
  const outputBase = path.join(publicOutputRoot, group.outputDir);
  const contentFile = `${slug}-${variantProfiles.content.suffix}.webp`;

  await writeVariant(source, path.join(outputBase, contentFile), variantProfiles.content);

  const publicDir = group.outputDir.split(path.sep).join("/");
  return `  ${key}: { src: asset("${toPublicPath(publicDir, contentFile)}") },`;
};

async function main() {
  await fs.mkdir(path.dirname(generatedModulePath), { recursive: true });

  const exports = [];

  for (const group of groups) {
    const entries = [];
    for (const [key, slug, sourcePath] of group.images) {
      const entry =
        group.type === "gallery"
          ? await buildGalleryEntry(group, key, slug, sourcePath)
          : await buildContentEntry(group, key, slug, sourcePath);
      entries.push(entry);
    }

    exports.push(
      `export const ${group.exportName} = {\n${entries.join("\n")}\n};\n`
    );
  }

  await fs.writeFile(generatedModulePath, `${moduleHeader}${exports.join("\n")}`);
  console.log(`Generated optimized images and ${path.relative(root, generatedModulePath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
