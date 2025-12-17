import { BrowserWindow } from "electron"
import path from 'node:path'
import { VITE_DEV_SERVER_URL, RENDERER_DIST, __dirname } from "../../libs/env";

const HASH = "dict"

export function useDictWindow() {
  let win: null | BrowserWindow;

  function createWindow(cb?: (win: BrowserWindow) => void) {
    win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      frame: false,
      width: 800,
      height: 600,
      // titleBarStyle: 'hidden',
      // autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.mjs'),
        devTools: true,
      },
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
      win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(`${VITE_DEV_SERVER_URL}/#/${HASH}`)
      win.webContents.openDevTools();
    } else {
      win.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: HASH })
    }

    cb && cb(win);

    return win;
  }

  function init() {
    return createWindow();
  }

  return { createWindow, init }
}
