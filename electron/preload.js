const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  product: (action, product, extra) => ipcRenderer.invoke("product", action, product, extra),
  logs: (action, product, log) => ipcRenderer.invoke("logs", action, product, log),
  fetch: (action, params) => ipcRenderer.invoke("fetch", action, params),
  generateReceipt: () => ipcRenderer.invoke("generateReceipt"),
});
