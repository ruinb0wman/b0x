import type { CSSProperties } from "react";
import Aside from "./components/Aside";
import Home from "./components/Home";

export default function Dict() {
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <Aside />
        <Home />
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  body: {
    height: '100vh',
    margin: 0,
    backgroundColor: '#f6f6f8',
    color: '#0f172a',
    fontFamily: '"Inter", sans-serif',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
  },
};
