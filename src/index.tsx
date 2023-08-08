import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './preview/App';
import reportWebVitals from './reportWebVitals';

import SimpleObjectEditor from './components/SimpleObjectEditor';
import { arrayReplace } from './utillity';
import { InputType, TypesProp } from './types';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

export default SimpleObjectEditor;
export { arrayReplace, InputType };
export type { TypesProp };
