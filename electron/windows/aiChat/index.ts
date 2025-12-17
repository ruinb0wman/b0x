import { BrowserWindow, screen } from "electron"
import path from 'node:path'
import { VITE_DEV_SERVER_URL, RENDERER_DIST, __dirname } from "../../libs/env";
import { registerOperation, registerShortcuts } from "./shortcuts";

let win: null | BrowserWindow;

export function useAiWindow() {
  function createWindow(cb?: (win: BrowserWindow) => void) {
    if (win) return win;

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const windowWidth = Math.floor(width / 3);

    win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      minWidth: 400, // Set a reasonable minimum width
      minHeight: 600,
      width: windowWidth,
      height: height,
      x: 0,
      y: 0,
      frame: false, // Remove window frame
      autoHideMenuBar: true, // Hide the menu bar
      webPreferences: {
        preload: path.join(__dirname, 'preload.mjs'),
        devTools: true,
        webviewTag: true
      },
    })

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(`${VITE_DEV_SERVER_URL}/#/ai`)
      win.webContents.openDevTools();
    } else {
      win.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: 'ai' })
    }

    cb && cb(win);

    return win;
  }

  function init() {
    return createWindow();
    // if (win) return win;
    // registerOperation(createWindow);
    // registerShortcuts(createWindow);
  }

  return { win, init }
}
