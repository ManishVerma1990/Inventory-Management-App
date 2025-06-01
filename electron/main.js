const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const database = require("./database");

let mainWindow;
const getIcon = () => {
  if (process.platform === "win32") {
    return path.join(__dirname, "../public/warehouse-svgrepo-com.ico");
  } else if (process.platform === "darwin") {
    return path.join(__dirname, "../public/warehouse-svgrepo-com.icns");
  } else {
    return path.join(__dirname, "../public/warehouse-svgrepo-com.png");
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    minWidth: 800,
    height: 600,
    minHeight: 600,
    titleBarStyle: "hidden",
    // expose window controlls in Windows/Linux
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    titleBarOverlay: {
      color: "#efefef",
      symbolColor: "#000",
      height: 40,
    },
    icon: getIcon(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
      nodeIntegration: false, // Enable Node.js integration in renderer (use with caution)
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  mainWindow.loadURL("http://localhost:5173");
  mainWindow.webContents.openDevTools();
  // mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));

  mainWindow.on("close", (event) => {
    event.preventDefault();
    console.log("Closing app safely...");
    mainWindow.destroy();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
