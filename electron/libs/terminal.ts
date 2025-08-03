import { spawn } from 'node-pty'
import type { IPty } from 'node-pty'
import { ipcMain, BrowserWindow } from 'electron'

export class TerminalManager {
  private terminals: Map<number, IPty> = new Map()
  private idCounter = 0

  constructor() {
    this.setupIpcHandlers()
  }

  private setupIpcHandlers() {
    ipcMain.handle('terminal:create', (_, { cols, rows }) => {
      const id = ++this.idCounter
      const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash'
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

      console.log(`Created terminal ${id} with shell: ${shell}`)
      // Add exit handler
      ptyProcess.on('exit', () => console.log(`Terminal ${id} exited`))

      this.terminals.set(id, ptyProcess)

      // Send data from terminal to renderer
      ptyProcess.on('data', data => {
        console.log('send data to renderer', data)
        const win = BrowserWindow.getFocusedWindow()
        if (win) {
          win.webContents.send('terminal:data', data)
        }
      })

      return id
    })

    ipcMain.handle('terminal:write', (_, { id, data }) => {
      console.log('get message from xterm', id, data)
      const pty = this.terminals.get(id)
      pty?.write(data)
    })

    ipcMain.handle('terminal:resize', (_, { id, cols, rows }) => {
      const pty = this.terminals.get(id)
      pty?.resize(cols, rows)
    })

    ipcMain.handle('terminal:destroy', (_, id) => {
      const pty = this.terminals.get(id)
      if (pty) {
        pty.kill()
        this.terminals.delete(id)
      }
    })
  }
}
