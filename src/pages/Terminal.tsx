import DragWrapper from "../components/DragWrapper";
import { TilingWMProvider } from '../components/TilingWM/TilingWMProvider';
import TilingWM from '../components/TilingWM/TilingWM';
import TermCom from "@/components/TermCom";

export default function App() {
  const renderPaneContent = (termId: string) => <TermCom termId={termId} />;

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', }}>
      <DragWrapper>
        <div style={{ width: '100vw', height: '5px' }}></div>
      </DragWrapper>
      <TilingWMProvider>
        <TilingWM renderPaneContent={renderPaneContent} />
      </TilingWMProvider>
    </div>
  );
}
