import { ipcMain, type BrowserWindow } from "electron"

export function registerOperation(win: BrowserWindow) {
  ipcMain.handle('open-devtool', () => {
    win.webContents.openDevTools();
  })
}
