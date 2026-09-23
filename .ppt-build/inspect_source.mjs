import { FileBlob, PresentationFile } from "@oai/artifact-tool";
const source = "C:\\Users\\psneh\\Downloads\\farmer_project_SIH-20260914T142152Z-1-001\\farmer_project_SIH\\output\\Farmer_Marketplace_Workflow_v2.pptx";
const presentation = await PresentationFile.importPptx(await FileBlob.load(source));
const snapshot = await presentation.inspect({ kind: "slide,textbox,shape,notes,layout", maxChars: 12000 });
console.log(snapshot.ndjson);
