import DragWrapper from "@/components/DragWrapper";
import TilingWM from '@/components/TilingWM';
import TermCom from "@/components/TermCom/TermCom";
import WindowTab from "@/components/WindowTab"

export default function App() {
  const renderPaneContent = (termId: string) => <TermCom termId={termId} />;

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <DragWrapper>
        <WindowTab />
      </DragWrapper>
      <TilingWM renderPaneContent={renderPaneContent} />
    </div>
  );
}
