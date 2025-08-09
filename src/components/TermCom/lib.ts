import type { Terminal } from "@xterm/xterm"
import type { FitAddon } from "@xterm/addon-fit";

export function bindTerminalEvents(terminal: Terminal, fitAddon: FitAddon, terminalRef: HTMLDivElement, resizeObserver: ResizeObserver, pid: number) {
  // 监听后端输出
  const onData = (_: any, dataObj: any) => {
    if (dataObj.id === pid && terminal) {
      terminal.write(dataObj.data)
    }
  }
  window.ipcRenderer.on('terminal:data', onData)

  // 监听用户输入
  const onTerminalData = (data: string) => {
    window.ipcRenderer.invoke('terminal:write', { id: pid, data }).catch((err) => {
      console.error('Failed to write to terminal:', err)
    })
  }
  terminal.onData(onTerminalData)

  // 监听 resize
  let resizeRequest: number
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRequest)
    resizeRequest = requestAnimationFrame(() => {
      if (fitAddon && terminalRef && terminal) {
        try {
          fitAddon.fit()
          const { cols, rows } = terminal;
          window.ipcRenderer.invoke('terminal:resize', { id: pid, cols, rows })
        } catch (e) {
          console.error('Resize error:', e)
        }
      }
    })
  })
  ro.observe(terminalRef)
  resizeObserver = ro

  // 清理函数
  return () => {
    window.ipcRenderer.off('terminal:data', onData)
    ro.disconnect()
  }
}

export function preventShortcutsCapture(terminal: Terminal) {
  terminal.attachCustomKeyEventHandler((event: KeyboardEvent) => {
    if (
      (event.ctrlKey || event.altKey) &&
      event.shiftKey &&
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      return false
    } else if (event.ctrlKey && event.key.toLowerCase() == 'w') {
      return false;
    }
    return true
  })
}
