import { app, BrowserWindow, Menu } from 'electron'
import { __dirname } from "./libs/env"
import { useTerminalWindow, useAiWindow } from "./windows"

const wins: (BrowserWindow | null)[] = []
const terminalWindow = useTerminalWindow();
const aiWindow = useAiWindow();

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform == 'darwin') return;
  wins.forEach(win => { win?.removeAllListeners() })
  app.quit()
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
  aiWindow.init();
  terminalWindow.init();
})
