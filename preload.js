const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("elApi", {
	async kvGet(value) {
		return await ipcRenderer.invoke("get-store-value", value);
	},
	async kvSet(entries) {
		return await ipcRenderer.invoke("set-store-values", entries);
	},
	async invoke(...params) {
		return await ipcRenderer.invoke(...params);
	},
	async stopApp() {
		return await ipcRenderer.invoke("stop-app");
	},
});
