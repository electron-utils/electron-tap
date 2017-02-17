var electron = require('electron');
var spawn = require('child_process').spawn;

var processArgv = process.argv.slice(2);
var args = ['./'].concat(processArgv);

var app = spawn(electron, args, {
  stdio: 'inherit'
});

app.on('close', () => {
  // User closed the app. Kill the host process.
  process.exit();
});
