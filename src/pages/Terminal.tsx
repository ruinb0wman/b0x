import '@xterm/xterm/css/xterm.css'
import TilingWM from "../components/TilingWM.tsx"
import Tabs from "../components/Tabs.tsx"

export default function TerminalPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Tabs>
        {(tab) => (
          <div style={{ width: '100%', height: '100%', visibility: tab.show ? 'visible' : 'hidden', position: tab.show ? 'relative' : 'absolute' }}>
            <TilingWM key={tab.id} />
          </div>
        )}
      </Tabs>
    </div>
  )
}
