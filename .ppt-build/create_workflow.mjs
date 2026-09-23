import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "C:\\Users\\psneh\\Downloads\\farmer_project_SIH-20260914T142152Z-1-001\\farmer_project_SIH";
const SKILL_DIR = "C:\\Users\\psneh\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.921.11914\\skills\\presentations";
const TMP_DIR = path.join(workspaceDir, ".ppt-build");
const FINAL_PPTX = path.join(workspaceDir, "output", "Farmer_Marketplace_Workflow_Detailed.pptx");
const RUNTIME_PYTHON = "C:\\Users\\psneh\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const { resolvePresentationFont, finalizePresentation } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools", "artifact_tool_utils.mjs")).href,
);
await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
const font = resolvePresentationFont({ fontFamily: "Aptos" });
const pres = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slide = pres.slides.add();
slide.background.fill = "#FBFCF9";

function shape(geometry, position, fill, line, name) {
  return slide.shapes.add({ geometry, name, position, fill, line });
}
function label(text, position, style, name) {
  const box = shape("textbox", position, "none", { style: "solid", fill: "none", width: 0 }, name);
  box.text = text;
  box.text.style = { typeface: font, autoFit: "shrinkText", ...style };
  return box;
}

// Header
label("How the Marketplace Works", { left: 72, top: 52, width: 780, height: 52 },
  { fontSize: 36, bold: true, color: "#173D28" }, "title");
label("A simple seven-step journey from farm registration to trusted repeat orders", { left: 72, top: 108, width: 900, height: 30 },
  { fontSize: 17, color: "#5C6B62" }, "subtitle");
shape("line", { left: 72, top: 154, width: 1136, height: 0 }, "none", { style: "solid", fill: "#B9D9C1", width: 2 }, "header-rule");

const steps = [
  ["01", "Create Account", "Farmer registers with a phone number, farm details and profile information."],
  ["02", "Add Produce", "Farmer adds crop type, quantity, price, availability and pickup location."],
  ["03", "Search Listings", "Buyer searches available produce and compares price, quality and seller ratings."],
  ["04", "Chat & Agree", "Buyer and farmer discuss quantity, price, pickup time and delivery terms."],
  ["05", "Confirm & Pay", "Buyer confirms the order and completes payment through the secure platform."],
  ["06", "Track Delivery", "Farmer prepares the order while the buyer follows pickup and delivery status."],
  ["07", "Rate the Order", "After delivery, both users rate the order to support trusted future purchases."],
];

const startX = 74, cardW = 150, gap = 12, cardY = 235, cardH = 326;
// Timeline behind the steps
shape("line", { left: 136, top: 213, width: 1008, height: 0 }, "none", { style: "solid", fill: "#86BB94", width: 3 }, "timeline");

steps.forEach(([num, title, body], i) => {
  const x = startX + i * (cardW + gap);
  const accent = i === 0 ? "#156B36" : "#238B45";
  const circle = shape("ellipse", { left: x + 52, top: 184, width: 46, height: 46 }, "#FFFFFF", { style: "solid", fill: accent, width: 3 }, `step-${i + 1}-marker`);
  circle.text = String(i + 1);
  circle.text.style = { typeface: font, fontSize: 17, bold: true, color: accent, alignment: "center", verticalAlignment: "middle" };
  const card = shape("roundRect", { left: x, top: cardY, width: cardW, height: cardH }, "#FFFFFF", { style: "solid", fill: "#B9D9C1", width: 1.25 }, `step-${i + 1}-card`);
  card.shadow = "shadow-sm";
  shape("rect", { left: x, top: cardY, width: cardW, height: 8 }, accent, { style: "solid", fill: accent, width: 0 }, `step-${i + 1}-accent`);
  label(num, { left: x + 18, top: cardY + 34, width: 100, height: 22 }, { fontSize: 13, bold: true, color: accent }, `step-${i + 1}-number`);
  label(title, { left: x + 18, top: cardY + 70, width: cardW - 36, height: 54 }, { fontSize: 19, bold: true, color: "#173D28" }, `step-${i + 1}-title`);
  label(body, { left: x + 18, top: cardY + 142, width: cardW - 36, height: 128 }, { fontSize: 14, color: "#324139" }, `step-${i + 1}-body`);
});

label("Designed for clarity: every stage explains who acts, what they do and what happens next.", { left: 72, top: 620, width: 1030, height: 28 }, { fontSize: 16, color: "#5C6B62", italic: true }, "footer");
slide.speakerNotes.textFrame.setText("Source: User-supplied project workflow screenshot. Slide copy condensed for presentation readability.");

const candidatePath = path.join(TMP_DIR, "workflow-candidate.pptx");
await (await PresentationFile.exportPptx(pres)).save(candidatePath);
const preview = await pres.export({ slide, format: "png", scale: 2 });
await fs.writeFile(path.join(TMP_DIR, "workflow-preview.png"), new Uint8Array(await preview.arrayBuffer()));

const result = await finalizePresentation({
  workspaceDir,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools", "inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools", "inspect_presentation_layout_geometry.py"),
  layoutArgs: ["--expected-slide-size-emu", "12192000,6858000", "--validate-bullet-geometry", "--validate-heading-fit"],
  explicitTotalSlideCount: 1,
  requiredNativeTableOwnerSlides: [],
  fontPolicy: { basis: "design", families: [font] },
  verifyArtifactToolImport: true,
  receiptPath: path.join(TMP_DIR, "validation-detailed.json"),
});
console.log(JSON.stringify({ finalPath: FINAL_PPTX, result }, null, 2));
