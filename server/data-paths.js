import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const serverDir = path.dirname(fileURLToPath(import.meta.url));

/** Dev default: <project>/data — never inside app.asar */
export function getDataRoot() {
  if (process.env.NEXUSAI_DATA_DIR) {
    return process.env.NEXUSAI_DATA_DIR;
  }
  return path.resolve(serverDir, "..", "data");
}

export function getDbPath() {
  return path.join(getDataRoot(), "nexusai.db");
}

export function getUploadsDir() {
  return path.join(getDataRoot(), "uploads");
}

function assertWritablePath(targetPath) {
  const normalized = targetPath.replace(/\\/g, "/");
  if (normalized.includes(".asar/") || normalized.endsWith(".asar")) {
    throw new Error(`Refusing to write inside read-only app.asar: ${targetPath}`);
  }
}

export function ensureDir(dirPath) {
  assertWritablePath(dirPath);
  if (fs.existsSync(dirPath)) {
    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) {
      throw new Error(`ENOTDIR: path is not a directory: ${dirPath}`);
    }
    return dirPath;
  }
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

export function ensureDataDirs() {
  const root = getDataRoot();
  assertWritablePath(root);
  ensureDir(root);
  ensureDir(getUploadsDir());
  return root;
}

/** Web dev fallback when APPDATA is used without NEXUSAI_DATA_DIR */
export function getDefaultWebDataRoot() {
  return path.join(process.env.APPDATA || os.homedir(), "nexusai");
}
