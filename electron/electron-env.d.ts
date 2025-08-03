/// <reference types="vite-plugin-electron/electron-env" />

declare module 'node-pty' {
  export interface IPty {
    readonly pid: number
    readonly process: string
    readonly cols: number
    readonly rows: number
    on(event: 'data', callback: (data: string) => void): void
    on(event: 'exit', callback: (code: number, signal?: number) => void): void
    write(data: string): void
    resize(cols: number, rows: number): void
    kill(signal?: string): void
  }
  
  export function spawn(
    file: string,
    args: string[] | string,
    options: any
  ): IPty
}

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer
}
