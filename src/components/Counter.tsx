// Counter.tsx
import { useTilingWM } from './TilingWM/TilingWMProvider';

export default function Counter({ termId }: { termId: string }) {
  const { state, dispatch } = useTilingWM();
  const term = state.terms[termId];

  if (!term) return <div>Terminal not found</div>;

  const increase = () => {
    dispatch({
      type: 'UPDATE_TERM_COUNT',
      termId,
      count: term.count + 1,
    });
  };

  return (
    <div
      onClick={increase}
      style={{
        padding: '20px',
        textAlign: 'center',
        fontSize: '24px',
        userSelect: 'none',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
      }}
    >
      {term.count}
    </div>
  );
}
