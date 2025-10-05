import { ipcMain, BrowserWindow } from 'electron';
import { useAiWindow } from './aiWindow'; // Assuming aiWindow.ts will be in the same directory
import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// This is needed because __dirname is not directly available in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export function useOperation(win: BrowserWindow) {
  ipcMain.handle('open-devtool', () => {
    console.log('open-devtool')
    win.webContents.openDevTools();
  })

  ipcMain.handle('open-ai', () => {
    console.log('open-ai');
    const { createWindow } = useAiWindow({
      VITE_DEV_SERVER_URL: process.env.VITE_DEV_SERVER_URL,
      RENDERER_DIST: path.join(process.env.APP_ROOT, 'dist'), // Use APP_ROOT for RENDERER_DIST
      __dirname: path.join(process.env.APP_ROOT, 'dist-electron'), // Use APP_ROOT for __dirname to point to main process files
    });
    createWindow();
  });
}
