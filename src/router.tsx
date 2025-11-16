import { createHashRouter } from 'react-router';
import App from './App';
import Terminal from '@/pages/Terminal';
import Ai from "./pages/Ai"

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/terminal',
    element: <Terminal />,
  },
  {
    path: '/ai',
    element: <Ai />,
  },
]);
