import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , glbPath, outputDirectory] = process.argv;

if (!glbPath || !outputDirectory) {
  throw new Error("Usage: node extract-glb-textures.mjs <model.glb> <output-directory>");
}

const file = await readFile(glbPath);
if (file.toString("ascii", 0, 4) !== "glTF") {
  throw new Error(`${glbPath} is not a binary glTF file`);
}

let offset = 12;
let document;
let binary;

while (offset < file.length) {
  const length = file.readUInt32LE(offset);
  const type = file.readUInt32LE(offset + 4);
  const chunk = file.subarray(offset + 8, offset + 8 + length);
  if (type === 0x4e4f534a) document = JSON.parse(chunk.toString("utf8"));
  if (type === 0x004e4942) binary = chunk;
  offset += 8 + length;
}

if (!document || !binary) throw new Error("GLB is missing JSON or binary data");

await mkdir(outputDirectory, { recursive: true });

for (const [index, image] of (document.images ?? []).entries()) {
  if (image.bufferView === undefined) continue;
  const view = document.bufferViews[image.bufferView];
  const start = (view.byteOffset ?? 0);
  const extension = image.mimeType === "image/png" ? "png" : "jpg";
  const safeName = (image.name ?? `texture-${index}`)
    .replace(/[^a-z0-9_-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const outputPath = path.join(outputDirectory, `${safeName || `texture-${index}`}.${extension}`);
  await writeFile(outputPath, binary.subarray(start, start + view.byteLength));
  console.log(outputPath);
}

