import type { BrowserWindow } from "electron";

export function registerLifeCircle(win: BrowserWindow) {
  win.on('close', () => {
    win.webContents.send('window-close');
  })
}
