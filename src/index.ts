//! /usr/bin/env bun
// json-flattener – flatten JSON to dot-notation
// Tiny, zero‑dependency, instant‑run CLI.

import { readFile } from "fs/promises";
import { stdin, argv, exit } from "process";

// Recursive flatten: obj, prefix -> map entries
function flatten(obj: any, prefix = ""): Record<string, any> {
  const out: Record<string, any> = {};
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${k}` : k;
      Object.assign(out, flatten(v, newKey));
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      const newKey = `${prefix}[${i}]`;
      Object.assign(out, flatten(v, newKey));
    });
  } else {
    out[prefix] = obj;
  }
  return out;
}

async function getInput(): Promise<string> {
  // If a filename is supplied, read it; otherwise read stdin.
  const file = argv[2];
  if (file && file !== "-") {
    return await readFile(file, "utf8");
  }
  // stdin mode – accumulate data
  const chunks: Uint8Array[] = [];
  for await (const chunk of stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

(async () => {
  try {
    const raw = await getInput();
    if (!raw.trim()) {
      console.error("No input provided.");
      exit(1);
    }
    const data = JSON.parse(raw);
    const flat = flatten(data);
    for (const [k, v] of Object.entries(flat)) {
      const val = typeof v === "string" ? JSON.stringify(v) : v;
      console.log(`${k} = ${val}`);
    }
  } catch (e: any) {
    console.error("Error:", e.message);
    exit(1);
  }
})();
