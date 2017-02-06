'use strict';

const {app, BrowserWindow} = require('electron');
// const TODO = require('../../index');

let win;

app.on('ready', function () {
  win = new BrowserWindow({
    center: true,
    width: 400,
    height: 600,
  });
  win.loadURL('file://' + __dirname + '/index.html');
});
