import { readFile } from "../lib/fileAction";
import { ListOfThemes } from "./ColorScheme";
const path = require("path");
const { Light } = ListOfThemes;
export const DEFAULT_THEME = Light;

function CheckCustomTheme(email) {
  let CUSTOM_THEMES;
  try {
    CUSTOM_THEMES = JSON.parse(readFile(path.join(email, "conf", "theme")));
    let themeObject = JSON.parse(CUSTOM_THEMES)?.ListOfThemes;
    return themeObject;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const DecideBetween = (email) => {
  return CheckCustomTheme(email) ? CheckCustomTheme(email) : ListOfThemes;
};
export const themes = (email) => {
  return DecideBetween(email);
};
