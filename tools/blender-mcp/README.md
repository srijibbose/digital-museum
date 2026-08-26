# Loupe Blender MCP bridge

This is a project-scoped local MCP server. It launches Blender in background mode
to generate the Dinosaur exhibit's reproducible evidence-study asset; it does not
run arbitrary Python supplied by an MCP client.

## Available tools

- `blender_status` — verifies the local Blender executable.
- `generate_dinosaur_evidence_model` — exports the original fossil-study `.blend`, compressed `.glb`,
  and a WebP review/fallback plate.
- `generate_dinosaur_species_collection` — creates legacy Tyrannosaurus,
  Triceratops, and Diplodocus teaching prototypes. These are retained for
  experimentation and are not used by the live institutional-specimen exhibit.
- `dinosaur_asset_status` — reports the generated files and their sizes.

The output is intentionally a labelled explanatory study. `OBSERVED_BONE_RECORD`
and `OBSERVED_TRACE_RECORD` are separate from `INTERPRETIVE_RECONSTRUCTION` and
`LIVING_LINEAGE_REFERENCE`; it is not a claim that the scene represents a complete
fossil or a photographed animal.

## Local host configuration

Add this entry to an MCP-capable host's local configuration, replacing the path if
the repository is elsewhere:

```json
{
  "mcpServers": {
    "loupe-blender": {
      "command": "node",
      "args": ["C:\\Users\\goura\\digital-museum\\tools\\blender-mcp\\server.mjs"],
      "env": {
        "BLENDER_EXECUTABLE": "C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe"
      }
    }
  }
}
```

Run `node tools/blender-mcp/server.mjs` only from an MCP host or Inspector: stdout
is reserved for newline-delimited JSON-RPC messages, while operational logs go to
stderr. The implementation follows the official stdio guidance from the
[MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/stdio.md).
