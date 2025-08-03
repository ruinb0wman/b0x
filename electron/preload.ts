import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(channel: string, listener: (...args: any[]) => void) {
    // Only allow specific terminal-related channels
    const validChannels = ['terminal:data']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    }
  },
  off(channel: string, listener: (...args: any[]) => void) {
    ipcRenderer.off(channel, listener)
  },
  send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args)
  },
  invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, ...args)
  },
})
