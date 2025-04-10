const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  product: (action, product) => ipcRenderer.invoke("product", action, product),
  logs: (action, product, log) => ipcRenderer.invoke("logs", action, product, log),
});
