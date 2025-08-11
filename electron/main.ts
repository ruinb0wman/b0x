import { app, BrowserWindow, Menu } from 'electron'
import { usePty } from './libs/pty'
import { useOperation } from "./libs/operation";
import { useLifeCircle } from "./libs/lifecircle"
import { fileURLToPath } from 'node:url'
import { useTerminalWindow } from './libs/terminalWindow';

import path from 'node:path'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// let win: BrowserWindow | null
const wins: (BrowserWindow | null)[] = []
const terminalWindow = useTerminalWindow({ RENDERER_DIST, VITE_DEV_SERVER_URL, __dirname });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform == 'darwin') return;
  app.quit()
  wins.forEach(win => win = null)
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    wins.push(terminalWindow.createWindow())
  }
})

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  // create terminalWindow
  terminalWindow.createWindow((win) => {
    // Initialize terminal manager
    const pty = usePty();
    pty.init(win);
    useLifeCircle(win);
    useOperation(win);
  })
})
