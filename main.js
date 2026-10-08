const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const dataDir = path.join(os.homedir(), '.config', 'uno-scoreboard');
const dataFile = path.join(dataDir, 'data.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

ipcMain.handle('scoreboard:load', () => {
  try {
    if (fs.existsSync(dataFile)) {
      return fs.readFileSync(dataFile, 'utf-8');
    }
  } catch (e) {
    console.error('Failed to read data file:', e);
  }
  return null;
});

ipcMain.handle('scoreboard:save', (event, json) => {
  try {
    ensureDataDir();
    fs.writeFileSync(dataFile, json, 'utf-8');
    return true;
  } catch (e) {
    console.error('Failed to write data file:', e);
    return false;
  }
});

ipcMain.handle('scoreboard:reveal', () => {
  ensureDataDir();
  if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, '{}', 'utf-8');
  shell.showItemInFolder(dataFile);
});

ipcMain.handle('scoreboard:path', () => dataFile);

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 760,
    minWidth: 480,
    minHeight: 560,
    icon: path.join(__dirname, 'build', 'icon.png'),
    title: 'UNO Scoreboard',
    backgroundColor: '#0b0b0c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  Menu.setApplicationMenu(null);
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
