var test = require('tape');
var parse = require('..');

test('vars', function (t) {
  var parser = parse()
    .readUInt8('length')
    .string('str', 'length');

  parser.on('data', function (data) {
    t.deepEqual(data, { length : 3, str : 'foo' });
    t.end();
  });

  var buf = new Buffer(4);
  buf.writeUInt8(3, 0);
  buf.write('foo', 1);
  parser.write(buf);
});
