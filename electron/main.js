const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";
const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000";

let mainWindow;

async function createBrowserWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"),
    },
    frame: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: -100, y: -100 }, // Hide native buttons by moving them off-screen
    show: false,
    transparent: true,
    backgroundColor: "transparent",
    hasShadow: true,
    vibrancy: "window",
    visualEffectState: "active",
    center: true,
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    return { action: "deny" };
  });

  win.once("ready-to-show", () => {
    console.log("Window ready to show");
    win.show();
    win.focus();
  });

  try {
    await win.loadURL(startUrl);
    console.log("Window loaded successfully");

    if (isDev) {
      win.webContents.openDevTools();
      console.log("DevTools opened");
    }
  } catch (error) {
    console.error("Failed to load window:", error);
  }

  return win;
}

async function createWindow() {
  console.log("Creating window...");
  mainWindow = await createBrowserWindow();

  // Handle window control events
  ipcMain.on("minimize-window", () => {
    mainWindow.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    mainWindow.close();
  });

  ipcMain.on("hide-window", () => {
    mainWindow.hide();
  });

  ipcMain.on("quit-app", () => {
    app.quit();
  });

  ipcMain.on("is-maximized", (event) => {
    event.returnValue = mainWindow.isMaximized();
  });

  // Handle new window creation
  ipcMain.on("create-window", async () => {
    await createBrowserWindow();
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log("Electron app is ready");
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  } else {
    // If window exists but is hidden, show it
    mainWindow?.show();
  }
});
