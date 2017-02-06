# electron-node-tap

[![Linux Build Status](https://travis-ci.org/electron-utils/electron-tap.svg?branch=master)](https://travis-ci.org/electron-utils/electron-tap)
[![Windows Build status](https://ci.appveyor.com/api/projects/status/agbtqhcwioetdloo?svg=true)](https://ci.appveyor.com/project/jwu/electron-tap)
[![Dependency Status](https://david-dm.org/electron-utils/electron-tap.svg)](https://david-dm.org/electron-utils/electron-tap)
[![devDependency Status](https://david-dm.org/electron-utils/electron-tap/dev-status.svg)](https://david-dm.org/electron-utils/electron-tap#info=devDependencies)

Tap testing in Electron. This project has two main value propositions:

  1. You can now easily test any JavaScript app in a real browser (Chromium) without hassling with PhantomJS or Webdriver.
  1. You can now easily test your Electron apps!

## Install

```bash
npm install -g electron-node-tap
```

## Run Examples:

```bash
npm start example
```

## Usage

```bash
electron-node-tap <path> [options]

Options:
  --help      Show help                                                [boolean]
  --version   Show version number                                      [boolean]
  --renderer  Run tests in renderer.                                   [boolean]
  --detail    Run test in debug mode (It will not quit the test, and open the
              devtools to help you debug it).         [boolean] [default: false]
  --reporter  Test reporter, default is 'dot'          [string] [default: "dot"]
```

If you run:

```bash
electron-node-tap ./tests
```

This runs the tests in the main process.

If you run:

```bash
electron-node-tap --renderer ./tests
```

This runs the tests in the renderer process.

## API Reference

TODO

## License

MIT © 2017 Johnny Wu
