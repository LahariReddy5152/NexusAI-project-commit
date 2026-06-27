import { app, BrowserWindow, Notification, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { startServer } from "../server/start.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;

let mainWindow = null;
let httpServer = null;
let serverPort = 0;

function getUserDataDir() {
  const dir = path.join(app.getPath("userData"), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function getStaticRoot() {
  if (isDev) return path.join(__dirname, "..");
  return path.join(process.resourcesPath, "app");
}

async function bootServer() {
  process.env.NEXUSAI_DATA_DIR = getUserDataDir();
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
  const iconPath = path.join(__dirname, "..", "build", "icon.png");

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
      preload: path.join(__dirname, "preload.js"),
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
    const n = new Notification({ title: title || "NexusAI", body: body || "", icon: path.join(__dirname, "..", "build", "icon.png") });
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
