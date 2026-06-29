import fs from "fs";
import path from "path";

/**
 * Reads a file's source code at build/request time (server only).
 * Pass a path relative to the project root, e.g. "components/demos/TableDemo.tsx"
 */
export function getSource(relativePath: string): string {
  const fullPath = path.join(process.cwd(), relativePath);
  return fs.readFileSync(fullPath, "utf-8");
}
