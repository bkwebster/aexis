const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";
const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000";

async function createWindow() {
  console.log("Creating window...");
  // Create the browser window.
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
    backgroundColor: "#fff",
    center: true,
  });

  // Enable window controls from renderer
  win.webContents.setWindowOpenHandler(({ url }) => {
    return { action: "deny" };
  });

  // Handle window control events
  ipcMain.on("minimize-window", () => {
    win.minimize();
  });

  ipcMain.on("maximize-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("close-window", () => {
    win.close();
  });

  ipcMain.on("is-maximized", (event) => {
    event.returnValue = win.isMaximized();
  });

  win.once("ready-to-show", () => {
    console.log("Window ready to show");
    win.show();
    win.focus();
  });

  // Load the app
  console.log(`Loading URL: ${startUrl}`);

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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
