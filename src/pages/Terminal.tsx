import { useEffect, useRef } from 'react'
import { Terminal as Xterminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminal = useRef<Xterminal>()
  const fitAddon = useRef<FitAddon>()

  useEffect(() => {
    const container = terminalRef.current
    if (!container) return

    // Initialize terminal
    terminal.current = new Xterminal({
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
      const { cols, rows } = terminal.current as Xterminal
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
        const { cols, rows } = terminal.current as Xterminal
        pty.resize(cols, rows)
      })
      if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current)
      }
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
