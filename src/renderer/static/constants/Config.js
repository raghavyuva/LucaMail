import { readFile } from "~/lib/fileAction";
const path = require("path");

export const config = JSON.parse(readFile(path.join("user", "user.txt")))
  ? JSON.parse(readFile(path.join("user", "user.txt")))
  : null;

export const sendConfig = JSON.parse(readFile(path.join("user", "smtp.txt")))
  ? JSON.parse(readFile(path.join("user", "user.txt")))
  : null;
