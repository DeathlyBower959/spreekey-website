import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
// Fonts
// import './fonts/FILENAME.ttf'
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div id='background' />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

function formatStyleObject(style: React.CSSProperties) {
  let outStyle = '';

  for (const [key, value] of Object.entries(style)) {
    outStyle += `${
      key
        .match(/[A-Z]?[a-z]+/g)
        ?.join('-')
        .toLowerCase() || 'UNKNOWN'
    }:${value}; `;
  }

  return outStyle.trim();
}

function writeConsole(value: string, ...styles: React.CSSProperties[]) {
  console.log(`%c${value}`, ...styles.map(arg => formatStyleObject(arg)));
}

writeConsole(
  `Currently working on an app rewrite, fixing the gallery page optimizations, and possibly introducing some nice new features :>`,
  {
    fontSize: '1.5em',
  },
  {
    color: 'red',
    fontSize: '1.5em',
  }
);

fetch('http://localhost:3000/api/trello');
