import type { CSSProperties } from 'react';
import TilingWM from './components/TilingWM';
import TermCom from "./components/TermCom";
import WindowTab from "./components/WindowTab"
import TermFunc from "./components/TermFunc"

export default function Terminal() {
  const renderPaneContent = (termId: string) => <TermCom termId={termId} />;

  return (
    <div style={styles.terminalPage}>
      <div style={styles.headerBar}>
        <div style={styles.noDrag}> <WindowTab /> </div>
        <div style={styles.noDrag}> <TermFunc /> </div>
      </div>
      <TilingWM renderPaneContent={renderPaneContent} />
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  terminalPage: {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  headerBar: {
    WebkitAppRegion: 'drag',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 5px',
    boxSizing: 'border-box'
  },
  noDrag: { WebkitAppRegion: 'no-drag' }
}
