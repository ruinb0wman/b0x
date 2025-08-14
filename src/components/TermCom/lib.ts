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
    const key = event.key.toLowerCase();

    // === 分屏快捷键 ===
    if ((event.ctrlKey || event.altKey) && event.shiftKey && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
      return false;
    }
    // === 关闭 Pane ===
    if (event.ctrlKey && key === 'w') {
      return false;
    }
    // === 新建 Window ===
    if (event.ctrlKey && key === 't') {
      return false;
    }
    // === 切换 Pane ===
    if (event.ctrlKey && key === 'tab') {
      return false;
    }
    // === 打开 DevTool ===
    if (event.ctrlKey && event.shiftKey && key === 'i') {
      return false;
    }

    // === 复制逻辑 ===
    if ((event.ctrlKey && key === 'c') || (event.ctrlKey && event.shiftKey && key === 'c')) {
      if (terminal.hasSelection()) {
        const text = terminal.getSelection();
        navigator.clipboard.writeText(text).catch(err => {
          console.error("Failed to copy:", err);
        });
        return false; // 阻止默认 Ctrl+C / SIGINT
      }
      return true; // 没有选区时，允许 SIGINT
    }

    // === 粘贴逻辑 ===
    if ((event.ctrlKey && key === 'v') || (event.ctrlKey && event.shiftKey && key === 'v')) {
      return false; // 阻止默认行为（避免 WSL quoted-insert）
    }

    return true; // 其他按键放行
  });
}

