import {
  base,
  dark,
  solarized,

  RavenBlack,
  creamRose,
  OceanRipples
} from "./ColorScheme";
export const DEFAULT_THEME = "base";

export const themes = {
  base,
  creamRose,
  dark,
  solarized,

  RavenBlack,
  OceanRipples
};


export const ListOfThemes = [
  {
    label: "base",
    primary: "#FFFFFF",
    isdark: false,
    default: true
  },
  {
    label: "creamRose",
    primary: "#EF7C8E",
    isdark: false,
    default: false
  },
  {
    label: "dark",
    primary: "#000000",
    isdark: true,
    default: false
  },
  {
    label: "solarized",
    primary: "#f25042",
    isdark: false,
    default: false
  },
  {
    label: "RavenBlack",
    primary: "black",
    isdark: true,
    default: false
  },
  {
    label: "OceanRipples",
    primary: "#7ec8e3",
    isdark: true,
    default: false
  }
]