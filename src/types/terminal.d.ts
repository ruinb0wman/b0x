export interface TerminalContainer {
  id: number;
  show: boolean;
}

export type SetTerminals = React.Dispatch<React.SetStateAction<TerminalContainer[]>>
export type Terminals = TerminalContainer[];
