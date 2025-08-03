import '@xterm/xterm/css/xterm.css'
import TermCom from "../components/TermCom.tsx"

export default function TerminalPage() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <TermCom />
    </div>
  )
}
