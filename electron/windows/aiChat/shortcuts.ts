import { type BrowserWindow, ipcMain, globalShortcut } from "electron"

export function registerShortcuts(createWindow: (cb?: (win: BrowserWindow) => void) => BrowserWindow) {
  globalShortcut.register('Home', () => toggleWin(createWindow))
}

export function registerOperation(createWindow: (cb?: (win: BrowserWindow) => void) => BrowserWindow) {
  ipcMain.handle('open-ai', () => toggleWin(createWindow));
}

function toggleWin(createWindow: (cb?: (win: BrowserWindow) => void) => BrowserWindow) {
  let isNew = false;
  const win = createWindow(() => isNew = true);
  // 如果窗口是新建的则跳过切换的步骤
  if (isNew) {
    isNew = false;
    return;
  }

  if (win.isVisible()) {
    win.hide()
  } else {
    win.show()
    win.focus()
  }
}
