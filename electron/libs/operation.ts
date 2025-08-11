import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";

export function useOperation(win: BrowserWindow) {
  ipcMain.handle('open-devtool', () => {
    console.log('open-devtool')
    win.webContents.openDevTools();
  })
}

