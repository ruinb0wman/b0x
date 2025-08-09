import type { ITerminalOptions, ITerminalInitOnlyOptions } from '@xterm/xterm';

const terminal: ITerminalOptions & ITerminalInitOnlyOptions = {
  cursorBlink: true,
  fontFamily: '"CaskaydiaCove Nerd Font Mono", "Courier New", monospace',
  scrollback: 100,
  fontSize: 16,
  fontWeight: 'normal',
  fontWeightBold: 'bold',
  allowTransparency: true,
  theme: {
    background: '#1a1b26',   // 背景色
    foreground: '#c0caf5',   // 默认前景色（普通文字）
    cursor: '#c0caf5',       // 光标颜色
    cursorAccent: '#1a1b26', // 光标文字颜色
    selectionBackground: '#33467c',    // 选中文本背景色

    black: '#15161e',
    red: '#f7768e',
    green: '#9ece6a',
    yellow: '#e0af68',
    blue: '#7aa2f7',
    magenta: '#bb9af7',
    cyan: '#7dcfff',
    white: '#a9b1d6',

    brightBlack: '#414868',
    brightRed: '#f7768e',
    brightGreen: '#9ece6a',
    brightYellow: '#e0af68',
    brightBlue: '#7aa2f7',
    brightMagenta: '#bb9af7',
    brightCyan: '#7dcfff',
    brightWhite: '#c0caf5',
  },
}

export default {
  terminal
}
