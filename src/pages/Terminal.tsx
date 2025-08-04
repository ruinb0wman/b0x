import '@xterm/xterm/css/xterm.css'
import TermCom from "../components/TermCom.tsx"
import { Button } from 'antd'
import { UpCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function TerminalPage() {
  const [tabs, setTabs] = useState([{ id: uuidv4(), show: true }]);

  function addTab() {
    setTabs(tabs.concat({ id: uuidv4(), show: false }))
  }

  function switchTab(index: number) {
    setTabs(tabs.map((item, i) => {
      return {
        ...item,
        show: index == i
      }
    }))
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div>
        {tabs.map((_, index) => {
          return (
            <Button type="primary" key={index} onClick={() => switchTab(index)}>
              <UpCircleOutlined />
            </Button>
          )
        })}
        <Button type="primary" onClick={addTab}>
          <PlusCircleOutlined />
        </Button>
      </div>
      {tabs.map((item) => {
        return (
          <div style={{ width: '100%', height: '100%', display: item.show ? 'block' : 'none' }}>
            <TermCom key={item.id} />
          </div>
        )
      })}
    </div>
  )
}
