import { readFile } from "../lib/fileAction";
import { ListOfThemes } from "./ColorScheme";
const path = require("path");
const { Light } = ListOfThemes;
export const DEFAULT_THEME = Light;

function CheckCustomTheme(email) {
  let themeObject;
  try {
    themeObject = JSON.parse(readFile(path.join(email, "conf", "theme")));
    return themeObject?.ListOfThemes ? themeObject?.ListOfThemes : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const DecideBetween = (email) => {
  return CheckCustomTheme(email) != null || CheckCustomTheme(email) != undefined ? CheckCustomTheme(email) : ListOfThemes;
};
export const themes = (email) => {
  return DecideBetween(email);
};
