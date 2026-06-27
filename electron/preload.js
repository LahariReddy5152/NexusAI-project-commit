import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("nexusDesktop", {
  isDesktop: true,
  showNotification(title, body) {
    return ipcRenderer.invoke("nexus-show-notification", { title, body });
  },
  getPort() {
    return ipcRenderer.invoke("nexus-get-port");
  }
});
