import '@xterm/xterm/css/xterm.css'
import TermCom from "../components/TermCom.tsx"
import Tabs from "../components/Tabs.tsx"

export default function TerminalPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Tabs>
        {(tab) => (
          <div style={{ width: '100%', height: '100%', display: tab.show ? 'block' : 'none' }}>
            <TermCom key={tab.id} />
          </div>
        )}
      </Tabs>
    </div>
  )
}
