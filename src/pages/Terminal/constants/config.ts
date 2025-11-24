import type { ITerminalOptions, ITerminalInitOnlyOptions } from '@xterm/xterm';
import { TERMINAL_THEME } from "@/assets/theme";

export const TERMINAL_TEMPLATE: ITerminalOptions & ITerminalInitOnlyOptions = {
  cursorBlink: true,
  fontFamily: '"CaskaydiaCove Nerd Font Mono", "Courier New", monospace',
  scrollback: 1000,
  fontSize: 18,
  fontWeight: 'normal',
  fontWeightBold: 'bold',
  allowTransparency: true,
  theme: TERMINAL_THEME,
}
