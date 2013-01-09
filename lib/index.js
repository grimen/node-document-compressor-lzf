require('sugar');
var util = require('util');

// HACK: ...until Node.js `require` supports `instanceof` on modules loaded more than once. (bug in Node.js)
var Compressor = global.NodeDocumentCompressor || (global.NodeDocumentCompressor = require('node-document-compressor'));

// -----------------------
//  DOCS
// --------------------
//  - https://github.com/Topface/node-lzf

// -----------------------
//  Constructor
// --------------------

// new LZF ()
// new LZF (options)
function LZF () {
  var self = this

  self.klass = LZF;
  self.klass.super_.apply(self, arguments);

  self.engine = require('lzf');
  self.binary = true;
}

util.inherits(LZF, Compressor);

// -----------------------
//  Class
// --------------------

LZF.defaults = {
  options: {
    encoding: 'utf8'
  }
};

LZF.options = Object.clone(LZF.defaults.options, true);

LZF.reset = Compressor.reset;

// -----------------------
//  Instance
// --------------------

// #compress (object)
LZF.prototype.compress = function(object, encoding) {
  var self = this, data;

  // REVIEW: Always expect `Buffer`?
  if (typeof object !== 'string') {
    object = JSON.stringify(object);
  }

  object = new Buffer(object, encoding || self.options.encoding);

  try {
    data = self.engine.compress(object);

  } catch (err) {
    err.name = "Compression: " + err.name;
    err.message = err.message + "  =>  " + util.inspect(data);
    throw err;
  }

  return data;
};

// #decompress (data)
LZF.prototype.decompress = function(data, encoding) {
  var self = this, object;

  if (typeof data === 'string') {
    data = new Buffer(data, encoding || self.options.encoding);
  }

  try {
    object = self.engine.decompress(data);

    // REVIEW: Always return `Buffer`?
    // if (typeof object !== 'string') {
    //   object = JSON.parse(object.toString(encoding || self.options.encoding));
    // }

  } catch (err) {
    err.name = "Decompression: " + err.name;
    err.message = err.message + "  =>  " + util.inspect(data);
    throw err;
  }

  return object;
}

// -----------------------
//  Export
// --------------------

module.exports = LZF;
