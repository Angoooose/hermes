import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

import { initializeApp } from 'firebase/app'; 
import firebaseConfig from './firebase.config';

let app = initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);