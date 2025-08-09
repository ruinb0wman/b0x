import DragWrapper from "@/components/DragWrapper";
import TilingWM from '@/components/TilingWM';
import TermCom from "@/components/TermCom/TermCom";

export default function App() {
  const renderPaneContent = (termId: string) => <TermCom termId={termId} />;

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', }}>
      <DragWrapper>
        <div >hello</div>
      </DragWrapper>
      <TilingWM renderPaneContent={renderPaneContent} />
    </div>
  );
}
