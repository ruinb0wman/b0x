import { createHashRouter } from 'react-router';
import Apps from './pages/Apps';
import Terminal from '@/pages/Terminal';
import Ai from "./pages/Ai"
import Dict from "./pages/Dict"

export const router = createHashRouter([
  { path: '/board', element: <Apps />, },
  { path: '/terminal', element: <Terminal />, },
  { path: '/ai', element: <Ai />, },
  { path: '/dict', element: <Dict /> },
]);
