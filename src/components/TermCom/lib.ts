import type { Terminal } from "@xterm/xterm"
import type { FitAddon } from "@xterm/addon-fit"

export function bindTerminalIO(terminal: Terminal, pid: number) {
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

  // 返回清理函数
  return () => {
    window.ipcRenderer.off('terminal:data', onData)
  }
}

export function observeResize(fitAddon: FitAddon, container: HTMLDivElement, terminal: Terminal, pid: number) {
  let resizeRequest: number
  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRequest)
    resizeRequest = requestAnimationFrame(() => {
      if (fitAddon && container && terminal) {
        try {
          fitAddon.fit()
          const { cols, rows } = terminal
          window.ipcRenderer.invoke('terminal:resize', { id: pid, cols, rows })
        } catch (e) {
          console.error('Resize error:', e)
        }
      }
    })
  })
  resizeObserver.observe(container)

  return () => {
    resizeObserver.disconnect()
  }
}

export function preventShortcutCapture(terminal: Terminal) {
  terminal.attachCustomKeyEventHandler((event: KeyboardEvent) => {
    if (
      (event.ctrlKey || event.altKey) &&
      event.shiftKey &&
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      // 分屏
      return false
    } else if (event.ctrlKey && event.key.toLowerCase() == 'w') {
      // 关闭pane
      return false;
    } else if (event.ctrlKey && event.key.toLowerCase() == 't') {
      // 新建window
      return false;
    } else if (event.ctrlKey && event.key.toLowerCase() == 'tab') {
      // 切换pane
      return false;
    } else if (event.ctrlKey) {
      // 复制粘贴
      if (event.key.toLowerCase() === 'c') {
        if (terminal.hasSelection()) {
          return false;
        }
        return true;
      } else if (event.key.toLowerCase() === 'v') {
        return true;
      }
    } else if (event.ctrlKey && event.shiftKey && event.key.toLocaleLowerCase() == 'i') {
      // 打开devtool
      return false
    }
    return true // Allow other keys to pass through by default
  })
}
