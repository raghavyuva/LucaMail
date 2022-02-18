const { app, screen, BrowserWindow } = require("electron");
const windowStateKeeper = require("electron-window-state");
const isProd = app.isPackaged;
module.exports = function createWindow(windowName = "main", options = {}) {
  const winOptions = {
    minWidth: 800,
    frame: false,
    minHeight: 600,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    trafficLightPosition: {
      x: 20,
      y: 32,
    },
    ...options,
    webPreferences: {
      contextIsolation: false,
      devTools: true,

      spellcheck: false,
      nodeIntegration: true,
      enableRemoteModule: true,
      ...(options.webPreferences || {}),
    },
  };

  let windowState = windowStateKeeper({
    defaultWidth: winOptions.minWidth,
    defaultHeight: winOptions.minHeight,
  });

  let win;

  win = new BrowserWindow({
    ...winOptions,
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    icon: __dirname + "/lucamail.png",
  });

  windowState.manage(win);

  return win;
};
