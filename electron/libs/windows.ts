import type { BrowserWindow } from "electron";
import { globalShortcut, ipcMain } from "electron";

export interface Window {
  win?: BrowserWindow;
  init: () => BrowserWindow;
  visibleShortCut?: string;
  visibleIpc?: string;
}

export type Windows = { [key: string]: Window };

const windows: Windows = {};

export function useWindow() {
  function getWindow(key?: string) {
    if (key) return windows[key];
    return windows;
  }

  function registerWindow(key: string, win: Window) {
    if (windows[key]) return;
    windows[key] = win;
    win.visibleShortCut && globalShortcut.register(win.visibleShortCut, () => toggleWin(win))
    win.visibleIpc && ipcMain.handle(win.visibleIpc, () => toggleWin(win));
  }

  function clearAll() {
    for (let key in windows) {
      windows[key].win?.removeAllListeners();
    }
  }

  return { getWindow, registerWindow, clearAll }
}

function toggleWin(win: Window) {
  if (!win.win) {
    win.win = win.init();
    return;
  }
  if (!win.win.isVisible()) {
    win.win.show();
  } else if (win.win.isFocused()) {
    win.win.hide();
  } else {
    win.win.focus();
  }
}
