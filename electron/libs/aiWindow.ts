import { BrowserWindow, screen } from "electron"
import path from 'node:path'

interface Props {
  VITE_DEV_SERVER_URL?: string
  RENDERER_DIST: string
  __dirname: string
}

export function useAiWindow({ VITE_DEV_SERVER_URL, RENDERER_DIST, __dirname }: Props) {
  let win: null | BrowserWindow;

  function createWindow(cb?: (win: BrowserWindow) => void) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const windowWidth = Math.floor(width / 3);
    const windowX = width - windowWidth;

    win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      minWidth: 400, // Set a reasonable minimum width
      minHeight: 600,
      width: windowWidth,
      height: height,
      x: windowX,
      y: 0,
      frame: false, // Remove window frame
      autoHideMenuBar: true, // Hide the menu bar
      webPreferences: {
        preload: path.join(__dirname, 'preload.mjs'),
        devTools: true,
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

  return { createWindow }
}
