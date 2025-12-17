import type { CSSProperties } from "react"
import { OpenAIOutlined, FileSearchOutlined, CodeOutlined } from "@ant-design/icons"
import { THEME } from "@/assets/theme"

export default function Apps() {
  return (
    <div style={styles.container}>
      {mock.map((item) => (
        <div style={styles.func} key={item.key}>
          {item.icon}
          <div>{item.name}</div>
          <div style={styles.key}>{item.key}</div>
        </div>
      ))}
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  func: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 1px #000',
    width: '100%',
    height: '100%',
    userSelect: 'none',
    cursor: 'pointer',
    position: 'relative'
  },
  key: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontSize: THEME.font_es
  }
}

const mock = [
  { key: 'num7', name: 'chat', icon: <OpenAIOutlined /> },
  { key: 'num8' },
  { key: 'num9', name: 'dict', icon: <FileSearchOutlined /> },
  { key: 'num4' },
  { key: 'num5', name: 'terminal', icon: <CodeOutlined /> },
  { key: 'num6' },
  { key: 'num1' },
  { key: 'num2' },
  { key: 'num3' },
]
