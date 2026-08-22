#!/usr/bin/env node
/**
 * Local stdio MCP bridge for Blender.
 *
 * The server intentionally exposes a narrow, project-scoped tool surface: it
 * can inspect the installed Blender runtime and build Loupe's authored dinosaur
 * evidence study. It never accepts arbitrary Python, shell commands, or output
 * directories from an MCP client.
 */

import { createInterface } from "node:readline";
import { access, mkdir, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(here, "..", "..");
const scriptPath = join(here, "blender_scripts", "generate_dinosaur_study.py");
const speciesScriptPath = join(here, "blender_scripts", "generate_dinosaur_species_collection.py");
const defaultBlenderPaths = process.platform === "win32"
  ? ["C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe"]
  : process.platform === "darwin"
    ? ["/Applications/Blender.app/Contents/MacOS/Blender"]
    : ["/usr/bin/blender", "/usr/local/bin/blender"];
const protocolVersion = "2025-06-18";

const tools = [
  {
    name: "blender_status",
    description: "Check the local Blender executable used by the Loupe asset pipeline.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} },
  },
  {
    name: "generate_dinosaur_evidence_model",
    description:
      "Generate the project-scoped dinosaur evidence-study GLB, Blender source file, and review plate. The output distinguishes observed fossil-bone, trace, comparative-bird, and interpretive-reconstruction layers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description: "Optional asset basename, lowercase letters, numbers, and hyphens only.",
          default: "theropod-evidence-study",
          pattern: "^[a-z0-9-]{3,64}$",
        },
        renderReviewPlate: {
          type: "boolean",
          description: "Render the local WebP fallback/review plate alongside the GLB.",
          default: true,
        },
      },
    },
  },
  {
    name: "generate_dinosaur_species_collection",
    description:
      "Generate legacy Blender-authored Tyrannosaurus, Triceratops, and Diplodocus teaching prototypes. These outputs are explicitly interpretive and are not used by the live institutional-specimen exhibit.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} },
  },
  {
    name: "dinosaur_asset_status",
    description: "Report whether the generated dinosaur GLB, Blender source, and review plate exist in the approved project locations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          default: "theropod-evidence-study",
          pattern: "^[a-z0-9-]{3,64}$",
        },
      },
    },
  },
];

function response(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function errorResponse(id, code, message, data) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message, data } })}\n`);
}

function toolResult(text, structuredContent) {
  return {
    content: [{ type: "text", text }],
    ...(structuredContent ? { structuredContent } : {}),
  };
}

function toolError(message) {
  return { content: [{ type: "text", text: message }], isError: true };
}

function assetName(value) {
  const name = value ?? "theropod-evidence-study";
  if (typeof name !== "string" || !/^[a-z0-9-]{3,64}$/.test(name)) {
    throw new Error("Asset name must contain only lowercase letters, numbers, and hyphens.");
  }
  return name;
}

async function firstAccessiblePath(paths) {
  for (const candidate of paths) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Keep looking; multiple Blender versions can be installed locally.
    }
  }
  return null;
}

async function blenderExecutable() {
  const configured = process.env.BLENDER_EXECUTABLE;
  const executable = await firstAccessiblePath(configured ? [configured, ...defaultBlenderPaths] : defaultBlenderPaths);
  if (!executable) {
    throw new Error(
      "Blender was not found. Set BLENDER_EXECUTABLE to the local blender executable before starting the MCP server.",
    );
  }
  return executable;
}

function run(command, args, cwd = workspaceRoot) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { cwd, windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", rejectRun);
    child.on("close", (code) => {
      if (code === 0) resolveRun({ stdout, stderr });
      else rejectRun(new Error(`Blender exited with code ${code}. ${stderr || stdout}`.trim()));
    });
  });
}

function pathsFor(name) {
  return {
    source: join(workspaceRoot, "assets", "blender", "dinosaurs", `${name}.blend`),
    glb: join(workspaceRoot, "public", "models", "dinosaurs", `${name}.glb`),
    plate: join(workspaceRoot, "public", "media", "dinosaurs", "review", `${name}.webp`),
  };
}

function speciesPaths() {
  const modelDirectory = join(workspaceRoot, "public", "models", "dinosaurs", "species");
  const plateDirectory = join(workspaceRoot, "public", "media", "dinosaurs", "species");
  const names = ["tyrannosaurus-motion-study", "triceratops-motion-study", "diplodocus-motion-study"];
  return {
    source: join(workspaceRoot, "assets", "blender", "dinosaurs", "species-motion-collection.blend"),
    modelDirectory,
    plateDirectory,
    names,
  };
}

async function fileDetails(path) {
  try {
    const details = await stat(path);
    return { path, exists: true, bytes: details.size };
  } catch {
    return { path, exists: false, bytes: 0 };
  }
}

async function statusFor(name) {
  const paths = pathsFor(name);
  return {
    name,
    model: await fileDetails(paths.glb),
    source: await fileDetails(paths.source),
    reviewPlate: await fileDetails(paths.plate),
  };
}

async function speciesStatus() {
  const paths = speciesPaths();
  return {
    source: await fileDetails(paths.source),
    species: await Promise.all(paths.names.map(async (name) => ({
      name,
      model: await fileDetails(join(paths.modelDirectory, `${name}.glb`)),
      reviewPlate: await fileDetails(join(paths.plateDirectory, `${name}.webp`)),
    }))),
  };
}

async function callTool(name, args = {}) {
  if (name === "blender_status") {
    const executable = await blenderExecutable();
    const version = await run(executable, ["--version"]);
    const firstLine = version.stdout.split(/\r?\n/).find(Boolean) ?? "Blender detected";
    return toolResult(firstLine, { executable, version: firstLine });
  }

  if (name === "dinosaur_asset_status") {
    const status = await statusFor(assetName(args.name));
    return toolResult(JSON.stringify(status, null, 2), status);
  }

  if (name === "generate_dinosaur_species_collection") {
    const paths = speciesPaths();
    await Promise.all([
      mkdir(dirname(paths.source), { recursive: true }),
      mkdir(paths.modelDirectory, { recursive: true }),
      mkdir(paths.plateDirectory, { recursive: true }),
    ]);
    const executable = await blenderExecutable();
    const result = await run(executable, [
      "--background",
      "--factory-startup",
      "--python",
      speciesScriptPath,
      "--",
      "--source",
      paths.source,
      "--model-dir",
      paths.modelDirectory,
      "--plate-dir",
      paths.plateDirectory,
    ]);
    const status = await speciesStatus();
    const complete = status.source.exists && status.species.every((species) => species.model.exists && species.reviewPlate.exists);
    if (!complete) {
      throw new Error(`Blender completed without every requested species asset. ${result.stderr || result.stdout}`.trim());
    }
    return toolResult(
      `Generated ${status.species.length} Blender-authored dinosaur motion studies and their local fallback plates.`,
      status,
    );
  }

  if (name === "generate_dinosaur_evidence_model") {
    const asset = assetName(args.name);
    const renderReviewPlate = args.renderReviewPlate !== false;
    const paths = pathsFor(asset);
    await Promise.all([mkdir(dirname(paths.source), { recursive: true }), mkdir(dirname(paths.glb), { recursive: true }), mkdir(dirname(paths.plate), { recursive: true })]);
    const executable = await blenderExecutable();
    const result = await run(executable, [
      "--background",
      "--factory-startup",
      "--python",
      scriptPath,
      "--",
      "--source",
      paths.source,
      "--glb",
      paths.glb,
      "--plate",
      paths.plate,
      "--render-plate",
      String(renderReviewPlate),
    ]);
    const status = await statusFor(asset);
    if (!status.model.exists || !status.source.exists || (renderReviewPlate && !status.reviewPlate.exists)) {
      throw new Error(`Blender completed without every requested output. ${result.stderr || result.stdout}`.trim());
    }
    return toolResult(
      `Generated ${asset}: ${status.model.bytes.toLocaleString()} byte GLB, ${status.source.bytes.toLocaleString()} byte Blender source${renderReviewPlate ? `, and ${status.reviewPlate.bytes.toLocaleString()} byte review plate` : ""}.`,
      status,
    );
  }

  throw new Error(`Unknown tool: ${name}`);
}

async function handle(message) {
  const { id, method, params } = message;
  if (!method) return;
  if (method === "notifications/initialized" || method.startsWith("notifications/")) return;
  if (method === "initialize") {
    response(id, {
      protocolVersion,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "loupe-blender", version: "1.0.0" },
      instructions:
        "This local bridge can generate only the project-scoped dinosaur evidence model. It never runs arbitrary Blender Python received from an MCP client.",
    });
    return;
  }
  if (method === "ping") {
    response(id, {});
    return;
  }
  if (method === "tools/list") {
    response(id, { tools });
    return;
  }
  if (method === "tools/call") {
    try {
      response(id, await callTool(params?.name, params?.arguments));
    } catch (cause) {
      response(id, toolError(cause instanceof Error ? cause.message : "Blender tool failed."));
    }
    return;
  }
  errorResponse(id, -32601, `Method not found: ${method}`);
}

const input = createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on("line", (line) => {
  void (async () => {
    try {
      await handle(JSON.parse(line));
    } catch (cause) {
      console.error(cause);
    }
  })();
});

console.error("Loupe Blender MCP server listening on stdio");
