import React, { useState, useEffect, useRef } from 'react';
import TermCom from './TermCom';
import { v4 as uuidV4 } from "uuid";

type NodeType = 'Leaf' | 'Vertical' | 'Horizon';

interface PaneNode {
  id: string;
  children: PaneNode[];
  type: NodeType;
  term: { id: string } | null;
}

interface Term {
  id: string;
}

export default function TilingWM() {
  const [rootPane, setRootPane] = useState(genPane());
  const [activePaneId, setActivePaneId] = useState<string | null>(null);

  function genPane(term?: Term | null): PaneNode {
    return {
      id: uuidV4(),
      children: [],
      type: 'Leaf',
      term: term || { id: uuidV4() },
    };
  }

  function attachPane(targetId: string, direction: 'left' | 'right' | 'up' | 'down') {
    const newPane = genPane();

    const newType: NodeType =
      direction === 'left' || direction === 'right' ? 'Vertical' : 'Horizon';

    function recursiveAttach(node: PaneNode): boolean {
      if (node.type === 'Leaf' && node.id === targetId) {
        node.type = newType;
        const copyPane = genPane(node.term);
        node.term = null;

        // 插入方向决定新pane的位置
        node.children =
          direction === 'left' || direction === 'up'
            ? [newPane, copyPane]
            : [copyPane, newPane];

        return true;
      }

      for (const child of node.children) {
        if (recursiveAttach(child)) return true;
      }

      return false;
    }

    const clonedRoot = structuredClone(rootPane);
    if (recursiveAttach(clonedRoot)) {
      setRootPane(clonedRoot);
      setActivePaneId(newPane.id);
    }
  }

  // 按键监听
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!activePaneId) return;

      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            attachPane(activePaneId, 'right');
            break;
          case 'ArrowLeft':
            e.preventDefault();
            attachPane(activePaneId, 'left');
            break;
          case 'ArrowUp':
            e.preventDefault();
            attachPane(activePaneId, 'up');
            break;
          case 'ArrowDown':
            e.preventDefault();
            attachPane(activePaneId, 'down');
            break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePaneId, rootPane]);

  function renderPane(pane: PaneNode): any {
    if (pane.type === 'Leaf') {
      return (
        <div
          key={pane.id}
          onClick={() => setActivePaneId(pane.id)}
          style={{
            flex: 1,
            border: activePaneId === pane.id ? '1px solid blue' : '1px solid #242424',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <TermCom />
        </div>
      );
    }

    return (
      <div
        key={pane.id}
        style={{
          display: 'flex',
          flexDirection: pane.type === 'Vertical' ? 'row' : 'column',
          flex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {pane.children.map((child) => renderPane(child))}
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {renderPane(rootPane)}
    </div>
  );
}

