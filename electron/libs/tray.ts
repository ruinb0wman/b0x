import type { Window } from './windows';
import { Tray } from 'electron';
import { VITE_PUBLIC } from './env';
import path from 'node:path';

let tray = null

interface CreateTrayProps { mainWindow: Window }

export function useTray() {

  function createTray({ mainWindow }: CreateTrayProps) {
    tray = new Tray(path.join(VITE_PUBLIC, 'terminal.png'))

    tray.on('click', () => {
      if (mainWindow.win) {
        if (mainWindow.win.isVisible()) {
          mainWindow.win.hide();
        } else {
          mainWindow.win.show();
        }
      } else {
        mainWindow.init();
      }
    })
  }

  return { createTray }
}
