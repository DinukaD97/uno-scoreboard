const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scoreboardAPI', {
  load: () => ipcRenderer.invoke('scoreboard:load'),
  save: (json) => ipcRenderer.invoke('scoreboard:save', json),
  reveal: () => ipcRenderer.invoke('scoreboard:reveal'),
  getPath: () => ipcRenderer.invoke('scoreboard:path')
});
