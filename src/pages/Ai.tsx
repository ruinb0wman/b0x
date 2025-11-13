import type { CSSProperties } from "react";

export default function Ai() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>header</div>
      <webview style={styles.webview} src="https://www.tongyi.com/" />
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    WebkitAppRegion: 'drag',
  },
  webview: {
    flex: 1,
    width: '100%',
  }
}
