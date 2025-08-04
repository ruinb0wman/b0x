import '@xterm/xterm/css/xterm.css'
import TermCom from "../components/TermCom.tsx"
import { Button } from 'antd'
import { UpCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { useState } from 'react'

export default function TerminalPage() {
  const [terminals, setTerminals] = useState([{ id: 0, show: false }]);

  function addTerminal() {
    setTerminals(terminals.concat({ id: terminals.length, show: false }))
  }

  function switchTab(index: number) {
    setTerminals(terminals.map((item, i) => {
      return {
        ...item,
        show: index == i
      }
    }))
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div>
        {terminals.map((_, index) => {
          return (
            <Button type="primary" key={index} onClick={() => switchTab(index)}>
              <UpCircleOutlined />
            </Button>
          )
        })}
        <Button type="primary" onClick={addTerminal}>
          <PlusCircleOutlined />
        </Button>
      </div>
      {terminals.map((item, index) => {
        return (
          <div style={{ width: '100%', height: '100%', display: item.show ? 'block' : 'none' }}>
            <TermCom key={index} />
          </div>
        )
      })}
    </div>
  )
}
