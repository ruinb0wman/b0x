import DragWrapper from "@/components/DragWrapper";
import TilingWM from '@/components/TilingWM';
import TermCom from "@/components/TermCom/TermCom";
import WindowTab from "@/components/WindowTab"
import TermFunc from "@/components/TermFunc"

export default function App() {
  const renderPaneContent = (termId: string) => <TermCom termId={termId} />;

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ WebkitAppRegion: 'drag', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 5px', boxSizing: 'border-box' }}>
        <div style={{ WebkitAppRegion: 'no-drag' }}>
          <WindowTab />
        </div>
        <div style={{ WebkitAppRegion: 'no-drag' }}>
          <TermFunc />
        </div>
      </div>
      {/* <DragWrapper> */}
      {/*   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}> */}
      {/*   </div> */}
      {/* </DragWrapper> */}
      <TilingWM renderPaneContent={renderPaneContent} />
    </div>
  );
}
