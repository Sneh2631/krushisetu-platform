import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "C:\\Users\\psneh\\Downloads\\farmer_project_SIH-20260914T142152Z-1-001\\farmer_project_SIH";
const SKILL_DIR = "C:\\Users\\psneh\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.909.12148\\skills\\presentations";
const TMP_DIR = path.join(workspaceDir, ".ppt-build", "secure-route-editable");
const FINAL_PPTX = path.join(workspaceDir, "output", "KrushiSetu_Secure_Sale_Route_Editable.pptx");
const RUNTIME_PYTHON = "C:\\Users\\psneh\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
const { resolvePresentationFont, finalizePresentation } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools", "artifact_tool_utils.mjs")).href,
);

await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });
const font = resolvePresentationFont({ fontFamily: "Aptos" });
const pres = Presentation.create({ slideSize: { width: 1280, height: 720 } });
const slide = pres.slides.add();
slide.background.fill = "#F7F8F1";

function addShape(geometry, position, fill, line, name) {
  return slide.shapes.add({ geometry, position, fill, line, name });
}
function text(textValue, position, style, name) {
  const box = addShape("textbox", position, "none", { style: "solid", fill: "none", width: 0 }, name);
  box.text = textValue;
  box.text.style = { typeface: font, autoFit: "shrinkText", marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0, ...style };
  return box;
}
function centered(textValue, position, style, name) {
  return text(textValue, position, { alignment: "center", verticalAlignment: "middle", ...style }, name);
}

const C = { dark: "#123D2E", lime: "#D9F55A", pale: "#DFF0C9", orangePale: "#FFF0E6", orange: "#B64B24", text: "#13392C", muted: "#5C7165", border: "#DBE4D6", line: "#9FBD81", white: "#FFFFFF" };

// Editable panel container
addShape("roundRect", { left: 300, top: 45, width: 680, height: 630 }, C.white, { style: "solid", fill: C.border, width: 2 }, "panel-container");
text("FROM CROP LOT TO BANK CREDIT", { left: 340, top: 75, width: 450, height: 20 }, { fontSize: 15, bold: true, color: "#527A56", characterSpacing: 1 }, "eyebrow");
text("A SALE YOU CAN TRACK", { left: 340, top: 108, width: 540, height: 40 }, { fontSize: 32, bold: true, color: C.text }, "headline");
addShape("roundRect", { left: 340, top: 157, width: 315, height: 34 }, C.orangePale, { style: "solid", fill: C.orangePale, width: 0 }, "net-payout-badge");
centered("₹ NET VISIBLE BEFORE DISPATCH", { left: 352, top: 164, width: 292, height: 20 }, { fontSize: 13, bold: true, color: C.orange }, "net-payout-badge-text");

// Route timeline
addShape("line", { left: 390, top: 270, width: 500, height: 0 }, "none", { style: "solid", fill: C.line, width: 5 }, "route-line");
const stages = [
  { n: "1", x: 390, title: "Crop lot", desc: "Grade + quantity" },
  { n: "2", x: 555, title: "Best buyer", desc: "Net payout checked" },
  { n: "3", x: 720, title: "Pickup", desc: "Shared transport" },
  { n: "4", x: 890, title: "Bank credit", desc: "Payment tracked" },
];
for (const [i, item] of stages.entries()) {
  const marker = addShape("ellipse", { left: item.x - 24, top: 246, width: 48, height: 48 }, C.dark, { style: "solid", fill: C.dark, width: 0 }, `stage-${i + 1}-marker`);
  marker.text = item.n;
  marker.text.style = { typeface: font, fontSize: 17, bold: true, color: C.lime, alignment: "center", verticalAlignment: "middle" };
  centered(item.title, { left: item.x - 65, top: 315, width: 130, height: 22 }, { fontSize: 14, bold: true, color: C.text }, `stage-${i + 1}-title`);
  centered(item.desc, { left: item.x - 69, top: 339, width: 138, height: 18 }, { fontSize: 12, color: C.muted }, `stage-${i + 1}-description`);
}

// Trust milestone strip
addShape("roundRect", { left: 340, top: 405, width: 600, height: 58 }, C.pale, { style: "solid", fill: C.pale, width: 0 }, "trust-strip");
centered("Verified buyer   •   Quality confirmed   •   Payment tracked", { left: 360, top: 422, width: 560, height: 24 }, { fontSize: 16, bold: true, color: C.text }, "trust-strip-text");

// Final statement
addShape("roundRect", { left: 340, top: 490, width: 600, height: 66 }, C.dark, { style: "solid", fill: C.dark, width: 0 }, "final-statement");
centered("ONE CROP LOT. ONE TRACEABLE SALE.", { left: 360, top: 507, width: 560, height: 23 }, { fontSize: 16, bold: true, color: C.lime }, "final-statement-title");
centered("From the farmer’s decision to confirmed payment", { left: 360, top: 532, width: 560, height: 16 }, { fontSize: 12, color: C.white }, "final-statement-subtitle");
centered("A clear decision before dispatch. Visibility until payment.", { left: 340, top: 595, width: 600, height: 18 }, { fontSize: 13, color: C.muted }, "caption");
slide.speakerNotes.textFrame.setText("Editable KrushiSetu slide component. Claims reflect supplied project functionality and should be updated to match the final implementation.");

const candidatePath = path.join(TMP_DIR, "candidate.pptx");
await (await PresentationFile.exportPptx(pres)).save(candidatePath);
const preview = await pres.export({ slide, format: "png", scale: 2 });
await fs.writeFile(path.join(TMP_DIR, "preview.png"), new Uint8Array(await preview.arrayBuffer()));

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
  receiptPath: path.join(TMP_DIR, "validation.json"),
});
console.log(JSON.stringify({ finalPath: FINAL_PPTX, result }, null, 2));
