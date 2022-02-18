import { readFile } from "~/lib/fileAction";
const path = require("path");
export const config = JSON.parse((readFile(path.join(
    "user",
    "user.txt")))) ? JSON.parse((readFile(path.join(
        "user",
        "user.txt"))))
    : null

export const sendConfig = {
    host: config?.host,
    port: 465,
    secure: true,
    auth: config?.auth
}