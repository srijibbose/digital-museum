import { spawn } from "node:child_process";
import { once } from "node:events";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function speakMcp(messages: unknown[]) {
  return new Promise<unknown[]>((resolveResult, reject) => {
    const server = spawn(process.execPath, [resolve(process.cwd(), "tools/blender-mcp/server.mjs")], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    server.stdout.on("data", (chunk) => { stdout += chunk; });
    server.stderr.on("data", (chunk) => { stderr += chunk; });
    server.on("error", reject);
    server.stdin.write(`${messages.map((message) => JSON.stringify(message)).join("\n")}\n`);
    server.stdin.end();
    void once(server, "close").then(([code]) => {
      if (code !== 0) {
        reject(new Error(stderr));
        return;
      }
      resolveResult(stdout.trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)));
    });
  });
}

describe("Loupe Blender MCP bridge", () => {
  it("negotiates MCP and exposes only the project-scoped Blender tools", async () => {
    const messages = await speakMcp([
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } },
      },
      { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
      {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: { name: "generate_dinosaur_evidence_model", arguments: { name: "not/allowed" } },
      },
    ]) as Array<{ id: number; result: { tools?: Array<{ name: string }>; isError?: boolean; serverInfo?: { name: string } } }>;

    expect(messages.find((message) => message.id === 1)?.result.serverInfo?.name).toBe("loupe-blender");
    expect(messages.find((message) => message.id === 2)?.result.tools?.map((tool) => tool.name)).toEqual([
      "blender_status",
      "generate_dinosaur_evidence_model",
      "generate_dinosaur_species_collection",
      "dinosaur_asset_status",
    ]);
    expect(messages.find((message) => message.id === 3)?.result.isError).toBe(true);
  });
});
