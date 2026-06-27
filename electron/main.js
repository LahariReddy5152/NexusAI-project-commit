import { app, BrowserWindow, Notification, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const electronDir = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let mainWindow = null;
let httpServer = null;
let serverPort = 0;

function ensureUserDataDir() {
  const userData = app.getPath("userData");
  if (!fs.existsSync(userData)) {
    fs.mkdirSync(userData, { recursive: true });
  }
  return userData;
}

function configureProductionPaths() {
  process.env.NEXUSAI_DATA_DIR = ensureUserDataDir();
  process.env.NEXUSAI_PACKAGED = "1";
}

function getStaticRoot() {
  return isDev ? path.join(electronDir, "..") : app.getAppPath();
}

function resolveIconPath() {
  const candidate = path.join(getStaticRoot(), "build", "icon.png");
  if (fs.existsSync(candidate)) return candidate;
  return path.join(electronDir, "..", "build", "icon.png");
}

async function bootServer() {
  if (app.isPackaged) {
    configureProductionPaths();
  }

  const { startServer } = await import("../server/start.js");
  const { server, port } = await startServer({
    host: "127.0.0.1",
    port: 0,
    staticRoot: getStaticRoot()
  });
  httpServer = server;
  serverPort = port;
  return port;
}

function createMainWindow(port) {
  const iconPath = resolveIconPath();

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    show: false,
    title: "NexusAI",
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(electronDir, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}/index.html`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function registerIpc() {
  ipcMain.handle("nexus-show-notification", (_event, { title, body }) => {
    if (!Notification.isSupported()) return false;
    const n = new Notification({
      title: title || "NexusAI",
      body: body || "",
      icon: resolveIconPath()
    });
    n.show();
    return true;
  });

  ipcMain.handle("nexus-is-desktop", () => true);
  ipcMain.handle("nexus-get-port", () => serverPort);
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    registerIpc();
    try {
      const port = await bootServer();
      createMainWindow(port);
    } catch (err) {
      console.error("NexusAI startup failed:", err);
      app.quit();
    }
  });

  app.on("window-all-closed", () => {
    if (httpServer) httpServer.close();
    app.quit();
  });

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0 && serverPort) {
      createMainWindow(serverPort);
    }
  });
}
