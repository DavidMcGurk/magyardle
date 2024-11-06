// Before (React 18 way):
// import { createRoot } from 'react-dom/client';

// After (React 17 way):
import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import App from './App';

// React 17: Use ReactDOM.render
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
