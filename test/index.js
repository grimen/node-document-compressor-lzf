
var Compressor = require('node-document-compressor');

module.exports = Compressor.Spec('LZF', {
  module: require('..'),
  engine: require('lzf'),
  options: {encoding: 'utf8'},
  pack: function(v) { return require('lzf').compress(new Buffer(v)); },
  unpack: require('lzf').decompress,
  binary: true
});
