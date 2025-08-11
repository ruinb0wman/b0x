import { CodeOutlined } from "@ant-design/icons"

export default function TermFunc() {
  function openDevTool() {
    window.ipcRenderer.invoke('open-devtool')
  }

  return (
    <CodeOutlined width={10} height={10} onClick={openDevTool} />
  )
}
