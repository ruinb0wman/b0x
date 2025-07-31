import { useEffect, useRef } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

declare global {
  interface Window {
    ipcRenderer: {
      createTerminal: (options: { cols: number; rows: number }) => Promise<any>
    }
  }
}

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminal = useRef<Terminal>()
  const fitAddon = useRef<FitAddon>()

  useEffect(() => {
    if (!terminalRef.current) return

    // Initialize terminal
    terminal.current = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      }
    })
    fitAddon.current = new FitAddon()
    terminal.current.loadAddon(fitAddon.current)
    terminal.current.open(terminalRef.current)
    fitAddon.current.fit()

    // Create terminal session
    const setupTerminal = async () => {
      const { cols, rows } = terminal.current as Terminal
      const pty = await window.ipcRenderer.createTerminal({ cols, rows })
      
      terminal.current?.onData(data => {
        pty.write(data)
      })

      pty.onData(data => {
        terminal.current?.write(data)
      })

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.current?.fit()
        const { cols, rows } = terminal.current as Terminal
        pty.resize(cols, rows)
      })
      resizeObserver.observe(terminalRef.current)
    }

    setupTerminal()

    return () => {
      terminal.current?.dispose()
    }
  }, [])

  return (
    <div 
      ref={terminalRef} 
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        boxSizing: 'border-box'
      }}
    />
  )
}
