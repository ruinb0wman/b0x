import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  createTerminal: async (options: { cols: number; rows: number }) => {
    try {
      const terminal = await ipcRenderer.invoke('createTerminal', options)
      return {
        ...terminal,
        onData: (callback: (data: string) => void) => {
          const channel = `terminal-data-${terminal.processId}`
          const listener = (_, data: string) => callback(data)
          ipcRenderer.on(channel, listener)
          
          // Return cleanup function
          return () => {
            ipcRenderer.off(channel, listener)
          }
        },
      }
    } catch (error) {
      console.error('Terminal creation failed:', error)
      return {
        processId: 'fallback',
        write: () => {},
        resize: () => {},
        kill: () => {},
        onData: () => {}
      }
    }
  },
})
