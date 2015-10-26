#!/usr/bin/env electron
'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _browserWindow = require('browser-window');

var _browserWindow2 = _interopRequireDefault(_browserWindow);

var _app = require('app');

var _app2 = _interopRequireDefault(_app);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var auth = (0, _index2['default'])(_browserWindow2['default']);
var argv = _yargs2['default'].argv;

var preventQuit = function preventQuit(e) {
  return e.preventDefault();
};

_app2['default'].on('will-quit', preventQuit);

_app2['default'].on('ready', function callee$0$0() {
  var token;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(auth.getAccessToken(argv.scopes, argv.clientId, argv.clientSecret));

      case 3:
        token = context$1$0.sent;

        process.stdout.write(JSON.stringify(token, null, 2));
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        process.stderr.write(context$1$0.t0.message + '\n');

      case 10:

        _app2['default'].removeListener('will-quit', preventQuit);
        _app2['default'].quit();

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
});