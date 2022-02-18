import { themes } from "./index";
export const mapTheme = (variables) => {
  return {
    "--color-primary": variables.primary || "",
    "--color-secondary": variables.secondary || "",
    "--color-positive": variables.accent || "",
    "--color-text-primary": variables.text || "",
    "--background-primary": variables.backgroundPrimary || "",
    "--background-secondary": variables.backgroundSecondary || "",
  };
};

export const applyTheme = (theme) => {
  const themeObject = mapTheme(themes[theme]);
  if (!themeObject) return;

  const root = document.documentElement;

  Object.keys(themeObject).forEach((property) => {
    if (property === "name") {
      return;
    }

    root.style.setProperty(property, themeObject[property]);
  });
};

export const extend = (extending, newTheme) => {
  return { ...extending, ...newTheme };
};
