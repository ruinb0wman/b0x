import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Terminal from './pages/Terminal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/terminal',
    element: <Terminal />,
  },
]);
