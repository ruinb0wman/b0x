import { CodeOutlined, RobotOutlined } from "@ant-design/icons"

type ActiveType = 'open-devtool' | 'open-ai'

export default function TermFunc() {
  function handleActive(type: ActiveType) {
    switch (type) {
      case 'open-devtool':
        window.ipcRenderer.invoke('open-devtool')
        break;
      case 'open-ai':
        window.ipcRenderer.invoke('open-ai')
        break;
    }
  }

  return (
    <div>
      <RobotOutlined style={{ marginRight: '10px' }} width={10} height={10} onClick={() => handleActive('open-ai')} />
      <CodeOutlined style={{ marginRight: '10px' }} width={10} height={10} onClick={() => handleActive('open-devtool')} />
    </div>
  )
}
