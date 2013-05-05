var Buffer = require('buffer').Buffer;
var inherits = require('util').inherits;
var Transform = require('readable-stream').Transform;

module.exports = Parser;

function Parser () {
  if (!(this instanceof Parser)) return new Parser();

  Transform.call(this, {
    objectMode : true
  });

  this.steps = [];
  this.idx = 0;
  this.res = {};
  this.offset = 0;
  this.buf = null;
}

inherits(Parser, Transform);

Parser.prototype._transform = function (chunk, encoding, done) {
  if (this.buf) {
    chunk = Buffer.concat([this.buf, chunk]);
    this.buf = null;
  }

  while (true) {
    var broken = false;
    for (var i = 0; i < this.steps.length; i++) {
      var step = this.steps[i];
      if (this.idx == i) {
        if (chunk.length < step.length + this.offset) {
          broken = true;
          break;
        }
        this.res[step.name] = step.fn(chunk, this.offset);
        this.offset += step.length;
        this.idx++;
      }

      if (i === this.steps.length - 1) {
        this.push(this.res);
        this.res = {};
        this.idx = 0;
      }
    }
    if (broken) break;
  }

  if (chunk.length != this.offset) {
    var dif = Math.abs(chunk.length - this.offset);
    this.buf = new Buffer(dif);
    chunk.copy(this.buf, 0, chunk.length - dif);
  }

  this.offset = 0;

  done();
};

Parser.prototype.next = function (name, length, fn) {
  this.steps.push({ name : name, length : length, fn : fn });
  return this;
};
