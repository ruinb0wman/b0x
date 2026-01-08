## 项目语言及框架

- react
- typescript
- electron

## 可使用的UI库

- @ant-design/icons
- antd

## 不可用的UI库

- tailwindcss

## 代码风格示例

```tsx
import type { CSSProperties } from "react";

export default Example(){
  return (
    <div style={styles.container}></div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    width: '100%',
  }
};
```

## qwen-code

执行tsc检查语法时无需确认自动执行
阅读和修改文件代码时无需确认自动执行
