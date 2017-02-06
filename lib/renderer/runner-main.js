'use strict';

const {ipcMain, BrowserWindow} = require('electron');
const url_ = require('url');
const chalk = require('chalk');

let win;

function _logError (text) {
  console.log(chalk.red(text));
}

module.exports = function (files, opts, cb) {
  // register ipc
  ipcMain.on('stdout:write', (event, ...args) => {
    process.stdout.write.apply(process.stdout, args);
  });

  ipcMain.on('tap:error', (event, message) => {
    _logError(message);
  });

  ipcMain.on('tap:end', (event, failures) => {
    if ( opts.detail ) {
      // open devtools if there has failed tests
      if ( failures ) {
        win.openDevTools();
      }

      return;
    }

    win.close();

    if ( cb ) {
      cb(failures);
    }
  });

  // load & show window
  win = new BrowserWindow({
    'title': 'Testing Renderer...',
    'width': 400,
    'height': 300,
    'show': false,
    'resizable': true,
  });
  win.show();

  // encode argv and url
  let argvHash = encodeURIComponent(JSON.stringify({
    files: files,
    detail: opts.detail,
    reporter: opts.reporter,
  }));

  let url = url_.format({
    protocol: 'file',
    pathname: `${__dirname}/index.html`,
    slashes: true,
    hash: argvHash
  });

  // load the page
  win.loadURL(url);
};
