(() => {
  'use strict';

  //
  const {ipcRenderer} = require('electron');

  // parse arguments
  // NOTE: hash is better than query from semantic, it means this is client data.
  let argv = {};
  if ( window.location.hash ) {
    let hash = window.location.hash.slice(1);
    argv = Object.freeze(JSON.parse(decodeURIComponent(hash)));
  }

  //
  process.stdout.write = function (...args) {
    ipcRenderer.send.apply(
      ipcRenderer, ['stdout:write', ...args]
    );
  };

  let tap = require('../share/tap');
  tap.detail = argv.detail;
  tap.init(argv.reporter);
  tap.on('end', () => {
    ipcRenderer.send('tap:end', tap._fail);
  });

  window.tap = tap;
  window.helper = require('./helper');
  window.suite = tap.suite;

  window.addEventListener('resize', () => {
    if ( window.helper.targetEL ) {
      window.helper.targetEL.dispatchEvent( new window.CustomEvent('resize') );
    }
  });

  window.onerror = function ( message, filename, lineno, colno, err ) {
    ipcRenderer.send('tap:error', err.stack || err);
  };

  // process files
  if ( argv.files ) {
    argv.files.forEach(file => {
      try {
        require(file);
      } catch (err) {
        ipcRenderer.send('tap:error', `Failed to load spec: ${file}\n ${err.stack}`);
      }
    });
  }

  tap.end();
})();
