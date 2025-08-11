import { BrowserWindow } from "electron"
import path from 'node:path'

interface Props {
  VITE_DEV_SERVER_URL?: string
  RENDERER_DIST: string
  __dirname: string
}

export function useTerminalWindow({ VITE_DEV_SERVER_URL, RENDERER_DIST, __dirname }: Props) {
  let win: null | BrowserWindow;

  function createWindow(cb?: (win: BrowserWindow) => void) {
    win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      frame: false,
      minWidth: 800,
      minHeight: 600,
      titleBarStyle: 'hidden',
      autoHideMenuBar: true,
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
      win.loadURL(`${VITE_DEV_SERVER_URL}/#/terminal`)
      win.webContents.openDevTools();
    } else {
      win.loadFile(path.join(RENDERER_DIST, 'index.html'), { hash: 'terminal' })
    }
    cb && cb(win);

    return win;
  }

  return { createWindow }
}
