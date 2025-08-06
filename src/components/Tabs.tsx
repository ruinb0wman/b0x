import { Button } from 'antd'
import { UpCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import DragWrapper from './DragWrapper'

export interface TabItem {
  id: string;
  show: boolean;
}

export default function Tabs({ children }: { children: (tab: TabItem) => JSX.Element }) {
  const [tabs, setTabs] = useState<TabItem[]>([{ id: uuidv4(), show: true }]);

  function addTab() {
    setTabs(tabs.concat({ id: uuidv4(), show: false }))
  }

  function switchTab(index: number) {
    setTabs(tabs.map((item, i) => ({
      ...item,
      show: index === i
    })))
  }

  return (
    <>
      <DragWrapper >
        <div>
          {tabs.map((_, index) => (
            <Button
              type="primary"
              key={index}
              onClick={() => switchTab(index)}
              style={{ WebkitAppRegion: 'no-drag' }}
            >
              <UpCircleOutlined />
            </Button>
          ))}
          <Button
            type="primary"
            onClick={addTab}
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            <PlusCircleOutlined />
          </Button>
        </div>
      </DragWrapper>
      {tabs.map((tab) => children(tab))}
    </>
  )
}
