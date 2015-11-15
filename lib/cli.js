/*
 * easidele
 *
 * Copyright (c) 2015 Jiheng Gao
 * Licensed under the MIT license.
 * https://github.com/jihgao/easidele/LICENSE-MIT
 */

'use strict';

// External lib.
var nopt = require('nopt');
var path = require("path");

exports.known = {help: Boolean, version: Boolean, source: path, destination: path};
exports.aliases = {h: '--help', V: '--version', v: '--verbose', s:['--source','./'], d:'--destination'};
// Parse them and return an options object.
Object.defineProperty(exports, 'options', {
  get: function() {
    return nopt(exports.known, exports.aliases, process.argv, 2);
  }
});
