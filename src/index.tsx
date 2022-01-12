import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css'

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase.config';

initializeApp(firebaseConfig);
export const database = getFirestore();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);