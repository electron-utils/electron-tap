'use strict';

const {app} = require('electron');
const yargs = require('yargs');
const fs = require('fs');
const globby = require('globby');
const path = require('path');
const chalk = require('chalk');

function _logError (text) {
  console.log(chalk.red(text));
}

function _done (failures) {
  if ( !failures ) {
    console.log(chalk.green('================================='));
    console.log(chalk.green('All tests passed, Congratulations! '));
    console.log(chalk.green('================================='));
  } else {
    console.log(chalk.red('================================='));
    console.log(chalk.red(`${failures.length} failes: `));
    console.log(chalk.red('================================='));
  }

  process.exit(failures);
}

app.on('ready', () => {
  yargs
    // .strict()
    .help('help')
    .version(app.getVersion())
    .usage('electron-tap <path> [options]')
    .options({
      'renderer': { type: 'boolean', desc: 'Run tests in renderer.' },
      'detail': { type: 'boolean', default: false, desc: 'Run test in debug mode (It will not quit the test, and open the devtools to help you debug it).' },
      'reporter': { type: 'string', default: 'dot', desc: 'Test reporter, default is \'dot\'' },
    })
    ;

  // parse the options in yargs
  // NOTE: this process will remove the app path from process.argv
  // WHY?
  // Usually we start electron application by: `electorn ./my-app --foo --bar`,
  // But some application (such as VS-Code) start it by: `electron --debug-brk="4032" ./my-app --foo --bar`
  // At the end it makes `yargs._` equals to [`./my-app`] which is unexpected for us.
  // NOTE: To understand why we use `yargs.parse()` instead of `yargs.argv`, see http://yargs.js.org/docs/#methods-argv
  let cwd = process.cwd();
  let argv = process.argv.slice(1);
  for ( let i = 0; i < argv.length; ++i ) {
    if ( path.resolve(cwd, argv[i]) === app.getAppPath() ) {
      argv.splice(i,1);
      break;
    }
  }

  let yargv = yargs.parse(argv);
  // console.log(yargv); // DEBUG

  // handle patterns
  let patterns = yargv._.map(pattern => {
    let stats = null;
    try {
      stats = fs.statSync(pattern);
    } catch (err) {
      return pattern;
    }

    if ( stats && stats.isDirectory() ) {
      return path.join(pattern, '**/*.spec.js');
    }

    return pattern;
  });

  // glob files
  let files = globby.sync([
    ...patterns,
    '!**/fixtures/**',
  ]);
  files = files.map(file => {
    return path.resolve(file);
  });

  // run in renderer process
  if ( yargv.renderer ) {
    try {
      let runner = require('./lib/renderer/runner-main');
      runner(files, yargv, _done);
    } catch (err) {
      _logError(err);
      process.exit(1);
    }
    return;
  }

  // run normal
  try {
    let runner = require('./lib/main/runner');
    runner(files, yargv, _done);
  } catch (err) {
    _logError(err);
    process.exit(1);
  }
});
