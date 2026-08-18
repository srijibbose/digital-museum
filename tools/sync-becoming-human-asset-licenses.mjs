import { writeFile } from "node:fs/promises";
import { becomingHumanAssets } from "../content/becoming-human-assets.ts";

const outputPath = new URL("../content/becoming-human-asset-licenses.json", import.meta.url);

await writeFile(outputPath, `${JSON.stringify(becomingHumanAssets, null, 2)}\n`, "utf8");

console.info(`Wrote ${becomingHumanAssets.length} licensed asset records`);
