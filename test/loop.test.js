var test = require('tape');
var parse = require('..');

test('basic loop', function (t) {
  var parser = parse()
    .loop('numbers', 3, function (loop) {
      loop.readUInt8('value');
    });

  parser.on('data', function (data) {
    t.deepEqual(data.numbers, [
      { value : 1 },
      { value : 2 },
      { value : 3 },
    ]);
    t.end();
  });

  var buf;
  buf = new Buffer(1); buf.writeUInt8(1, 0); parser.write(buf);
  buf = new Buffer(1); buf.writeUInt8(2, 0); parser.write(buf);
  buf = new Buffer(1); buf.writeUInt8(3, 0); parser.write(buf);
});
