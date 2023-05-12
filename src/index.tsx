import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fonts
// import './fonts/FILENAME.ttf'

import { BrowserRouter } from 'react-router-dom';

import './index.css';

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
  `I know the gallery page is slow, im working on optimizations with masonic and maybe another method, I simply wanted to get a %cproduction version out.`,
  {
    fontSize: '1.5em',
  },
  {
    color: 'red',
    fontSize: '1.5em',
  }
);
