import { app, BrowserWindow, Menu } from 'electron'
import { __dirname } from "./libs/env"
import { useTerminalWindow, useAiWindow, useMainWindow } from "./windows"
import { useTray } from "./libs/tray";
import { useWindow } from './libs/windows';

// const wins: (BrowserWindow | null)[] = []
const terminalWindow = useTerminalWindow();
const aiWindow = useAiWindow();
const mainWindow = useMainWindow();
const tray = useTray();
const windows = useWindow();

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform == 'darwin') return;
  // wins.forEach(win => { win?.removeAllListeners() })
  app.quit()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  // if (BrowserWindow.getAllWindows().length === 0) {
  // wins.push(terminalWindow.createWindow())
  // }
})

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const mainWin = {
    win: mainWindow.init(),
    visibleIpc: 'toggle-main',
    visibleShortCut: 'numsub',
    init: mainWindow.init
  };
  windows.registerWindow('main', mainWin)
  tray.createTray({ mainWindow: mainWin });

  windows.registerWindow('terminal', {
    visibleIpc: 'toggle-terminal',
    visibleShortCut: 'num5',
    init: terminalWindow.init
  })
  windows.registerWindow('ai', {
    visibleIpc: 'toggle-ai',
    visibleShortCut: 'num7',
    init: aiWindow.init
  })
  // aiWindow.init();
  // terminalWindow.init();
})
