import { type BrowserWindow, ipcMain, globalShortcut } from "electron"

export function registerShortcuts(createWindow: (cb?: (win: BrowserWindow) => void) => BrowserWindow) {
  globalShortcut.register('Home', () => toggleWin('Home', createWindow))
}

export function registerOperation(createWindow: (cb?: (win: BrowserWindow) => void) => BrowserWindow) {
  ipcMain.handle('open-ai', () => toggleWin('open-ai', createWindow));
}

function toggleWin(from: 'Home' | 'open-ai', createWindow: (cb?: (win: BrowserWindow) => void) => BrowserWindow) {
  let isNew = false;
  const win = createWindow(() => isNew = true);
  // 如果窗口是新建的则跳过切换的步骤
  if (isNew) {
    isNew = false;
    return;
  }

  if (win.isVisible()) {
    // 如果是通过按键点击直接隐藏
    if (from === 'open-ai') {
      win.hide();
      // 如果是快捷键则判断是否focused, focused则隐藏否则focus
    } else if (win.isFocused()) {
      win.hide()
    } else {
      win.focus()
    }
  } else {
    win.show();
    win.focus();
  }
}
