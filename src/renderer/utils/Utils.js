import { readFile } from "../lib/fileAction";
const path = require("path");
export async function ParseContent(folder, filename) {
  return JSON.parse(readFile(path.join(folder, filename)))
    ? JSON.parse(readFile(path.join(folder, filename)))
    : null;
}
