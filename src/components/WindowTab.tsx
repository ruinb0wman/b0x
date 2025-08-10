import { useTerminalStore } from '@/store/terminalStore/terminalStore'

export default function WindowTab() {
  const { state } = useTerminalStore();

  function TabButton({ children, isActive }: { children: React.ReactNode, isActive: boolean }) {
    return (
      <div style={{ width: '20px', height: '20px', border: isActive ? '1px solid blue' : '1px solid #fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' }}>
        {children}
      </div>)
  }

  return (
    <div style={{ display: 'flex', gap: '10px', margin: '10px 5px' }}>
      {state.windows.map((_, i) => {
        return (
          <TabButton key={i} isActive={state.activeWindowIndex == i}>{i + 1}</TabButton>
        )
      })}
      <TabButton isActive={false}>+</TabButton>
    </div>
  )
}
