import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebglAddon } from '@xterm/addon-webgl';
import { v4 as uuidV4 } from 'uuid';

// 每个终端实例的元数据
interface TerminalInstance {
  id: string;           // 前端唯一 ID（对应 term.id）
  terminal: Terminal;
  fitAddon: FitAddon;
  ptyId: number | null; // 后端 pty 进程 ID
  container: HTMLDivElement | null; // 当前挂载的 DOM
  resizeObserver: ResizeObserver | null;
}

// 全局终端管理器
class TerminalManager {
  private instances = new Map<string, TerminalInstance>();
  private static instance: TerminalManager;

  static getInstance() {
    if (!TerminalManager.instance) {
      TerminalManager.instance = new TerminalManager();
    }
    return TerminalManager.instance;
  }

  // 创建新终端
  async create(id: string): Promise<void> {
    if (this.instances.has(id)) return;

    const terminal = new Terminal({
      fontSize: 14,
      cursorBlink: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff',
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    try {
      terminal.loadAddon(new WebglAddon());
    } catch (e) {
      console.warn('WebGL addon failed, falling back to canvas');
    }

    // 初始化 pty
    let ptyId: number | null = null;
    try {
      ptyId = await window.ipcRenderer.invoke('terminal:create', { cols: 80, rows: 24 });
    } catch (err) {
      console.error('Failed to create pty:', err);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!instance.container) return;
      fitAddon.fit();
      const { cols, rows } = terminal;
      if (cols > 0 && rows > 0 && instance.ptyId) {
        window.ipcRenderer.invoke('terminal:resize', { id: instance.ptyId, cols, rows });
      }
    });

    const instance: TerminalInstance = {
      id,
      terminal,
      fitAddon,
      ptyId,
      container: null,
      resizeObserver,
    };

    // 绑定数据流
    terminal.onData((data) => {
      if (instance.ptyId) {
        window.ipcRenderer.invoke('terminal:write', { id: instance.ptyId, data }).catch(console.error);
      }
    });

    const onData = (_: any, dataObj: { id: number; data: string }) => {
      if (dataObj.id === instance.ptyId) {
        instance.terminal.write(dataObj.data);
      }
    };

    // 存储实例
    this.instances.set(id, instance);

    // 挂载到 IPC
    window.ipcRenderer.on('terminal:data', onData);

    // 清理函数
    const dispose = () => {
      this.instances.delete(id);
      window.ipcRenderer.off('terminal:data', onData);
      if (instance.ptyId) {
        window.ipcRenderer.invoke('terminal:destroy', instance.ptyId).catch(console.error);
      }
      if (instance.container) {
        instance.resizeObserver?.disconnect();
      }
      instance.terminal.dispose();
    };

    // 暴露 dispose 以便 TermCom 调用
    (terminal as any)._dispose = dispose;
  }

  // 获取实例
  get(id: string) {
    return this.instances.get(id) || null;
  }

  // 挂载 terminal 到 DOM
  mount(id: string, container: HTMLDivElement) {
    const instance = this.instances.get(id);
    if (!instance) return;

    // 先卸载旧的
    if (instance.container) {
      // 从 DOM 移除 xterm 的渲染容器
      if (instance.terminal.element && instance.terminal.element.parentNode) {
        instance.terminal.element.parentNode.removeChild(instance.terminal.element);
      }
      instance.resizeObserver?.unobserve(instance.container);
    }

    instance.container = container;
    instance.terminal.open(container); // 重新挂载到新容器
    instance.fitAddon.fit();
    instance.resizeObserver?.observe(container);
  }

  // 卸载：只从 DOM 移除，不销毁 terminal
  unmount(id: string) {
    const instance = this.instances.get(id);
    if (!instance || !instance.container) return;

    // 从 DOM 移除 xterm 渲染的元素
    if (instance.terminal.element && instance.terminal.element.parentNode) {
      instance.terminal.element.parentNode.removeChild(instance.terminal.element);
    }

    instance.resizeObserver?.unobserve(instance.container);
    instance.container = null;
  }

  // 销毁终端（退出时调用）
  dispose(id: string) {
    const instance = this.instances.get(id);
    if (instance && (instance.terminal as any)._dispose) {
      (instance.terminal as any)._dispose();
    }
  }

  // 获取所有实例 ID
  getAllIds() {
    return Array.from(this.instances.keys());
  }
}

export const terminalManager = TerminalManager.getInstance();

// 工厂函数：创建新终端并返回 id
export function createTerminal(): string {
  const id = uuidV4();
  terminalManager.create(id);
  return id;
}
