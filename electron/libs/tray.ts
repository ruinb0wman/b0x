import { Tray, Menu } from 'electron';
import { VITE_PUBLIC } from './env';
import path from 'node:path';

let tray = null

export function useTray() {
  function createTray() {
    tray = new Tray(path.join(VITE_PUBLIC, 'terminal.png'))
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
  }

  return { createTray }
}
