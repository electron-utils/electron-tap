'use strict';

const chalk = require('chalk');

function _logError (text) {
  console.log(chalk.red(text));
}

module.exports = function (files, opts, cb) {
  let tap = require('../share/tap');

  tap.init(opts.reporter);
  tap.on('end', () => {
    if ( cb ) {
      cb(tap._fail);
    }
  });

  global.tap = tap;
  global.helper = require('../share/helper');
  global.suite = tap.suite;

  //
  files.forEach(file => {
    try {
      require(file);
    } catch (err) {
      _logError(`Failed to load spec: ${file}`);
    }
  });

  tap.end();
};
