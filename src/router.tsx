import { createHashRouter } from 'react-router';
import App from './App';
import Terminal from './pages/Terminal';

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/terminal',
    element: <Terminal />,
  },
]);
