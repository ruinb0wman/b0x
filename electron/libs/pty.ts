import type { IPty } from "node-pty";
import { spawn } from 'node-pty'
import { ipcMain, BrowserWindow } from 'electron'

export function usePty() {
  const ptys = new Map<number, IPty>();

  function init(win: BrowserWindow) {
    // handle create new terminal
    ipcMain.handle('terminal:create', (_, { cols, rows }) => {
      const shell = process.platform === 'win32' ? 'wsl.exe' : 'bash'
      const ptyProcess = spawn(shell, [], {
        name: 'xterm-256color',
        cols: cols || 80,
        rows: rows || 30,
        cwd: process.env.USERPROFILE || process.env.HOME,
        env: {
          ...process.env,
          TERM: 'xterm-256color',
          COLORTERM: 'truecolor'
        }
      })
      console.log('[terminal:create]', ptyProcess.pid)

      // Add exit handler
      ptyProcess.on('exit', () => {
        console.log(`Terminal ${ptyProcess.pid} exited`)
      })

      // Send data from terminal to renderer
      ptyProcess.on('data', data => {
        // console.log('[pty:send terminal:data]', ptyProcess.pid, data)
        win.webContents.send('terminal:data', {
          id: ptyProcess.pid,
          data
        })
      })

      ptys.set(ptyProcess.pid, ptyProcess);
      return ptyProcess.pid;
    })

    // handle write data to pty
    ipcMain.handle('terminal:write', (_, { id, data }) => {
      // console.log('get message from xterm', id, data)
      const pty = ptys.get(id)
      pty?.write(data)
    })

    // handle resize pty
    ipcMain.handle('terminal:resize', (_, { id, cols, rows }) => {
      const pty = ptys.get(id)
      pty?.resize(cols, rows)
    })

    // handle destroy pty
    ipcMain.handle('terminal:destroy', (_, id) => {
      console.log('[terminal:destroy]', id)
      const pty = ptys.get(id)
      if (pty) {
        pty.kill()
        ptys.delete(id);
      }
    })
  }

  return { init }
}
