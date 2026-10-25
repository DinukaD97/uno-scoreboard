const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('scoreboardAPI', {
  load: () => ipcRenderer.invoke('scoreboard:load'),
  save: (json) => ipcRenderer.invoke('scoreboard:save', json),
  exportBackup: (json) => ipcRenderer.invoke('scoreboard:exportBackup', json),
  importBackup: () => ipcRenderer.invoke('scoreboard:importBackup')
});
