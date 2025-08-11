import type { BrowserWindow } from "electron";

export function useLifeCircle(win: BrowserWindow) {
  win.on('close', () => {
    win.webContents.send('window-close');
  })
}
