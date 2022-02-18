const createWindow = require("./helpers/create-window.js");
const { app, ipcMain, Menu, MenuItem } = require("electron");
const contextMenu = require("electron-context-menu");
const Store = require("electron-store");
const store = new Store();
const ipc = ipcMain;
const path = require("path");
const url = require("url");
try {
  require("electron-reloader")(module);
} catch {}

const isDev = !app.isPackaged;

let mainWindow;
function loadVitePage(port) {
  mainWindow.loadURL(`http://localhost:${port}`).catch((err) => {
    setTimeout(() => {
      loadVitePage(port);
    }, 200);
  });
}

contextMenu({
  showSearchWithGoogle: false,
  showCopyImage: false,
});

ipc.on("closeApp", () => {
  mainWindow.close();
});

ipc.on("minimizeApp", () => {
  mainWindow.minimize();
});

ipc.on("maximizeApp", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});


function createMainWindow() {
  mainWindow = createWindow("main", {
    show: false,
  });
  mainWindow.once("close", () => {
    mainWindow = null;
  });

  const port = process.env.PORT || 3333;
  if (isDev) {
    loadVitePage(port);
  } else {
    // mainWindow.webContents.openDevTools()
    mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });
 
}

app.once("ready", createMainWindow);
app.on("activate", () => {
  if (!mainWindow) {
    createMainWindow();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
