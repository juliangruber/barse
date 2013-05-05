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

/**
 * Register a parser function.
 *
 * @param {String} name
 * @param {Number} length
 * @param {Function} fn
 */

Parser.prototype.next = function (name, length, fn) {
  this.steps.push({ name : name, length : length, fn : fn });
  return this;
};

/**
 * API sugar.
 */

Parser.string = function (name, length, encoding) {
  this.next(name, length, function (chunk, offset) {
    return chunk.toString(encoding, offset, offset + length);
  });
};

Parser.buffer = function (name, length) {
  this.next(name, length, function (chunk, offset) {
    var buf = new Buffer(length);
    chunk.copy(buf, 0, offset, offset + length);
    return buf;
  });
};

Parser.readUInt8 = function (name) {
  this.next(name, 1, function (chunk, offset) {
    return chunk.readUInt8(offset);
  });
};

Parser.readUInt16LE = function (name) {
  this.next(name, 2, function (chunk, offset) {
    return chunk.readUInt16LE(offset);
  });
};

Parser.readUInt16BE = function (name) {
  this.next(name, 2, function (chunk, offset) {
    return chunk.readUInt16BE(offset);
  });
};

Parser.readUInt32LE = function (name) {
  this.next(name, 4, function (chunk, offset) {
    return chunk.readUInt32LE(offset);
  });
};

Parser.readUInt32BE = function (name) {
  this.next(name, 4, function (chunk, offset) {
    return chunk.readUInt32BE(offset);
  });
};

Parser.readInt8 = function (name) {
  this.next(name, 1, function (chunk, offset) {
    return chunk.readInt8(offset);
  });
};

Parser.readInt16LE = function (name) {
  this.next(name, 2, function (chunk, offset) {
    return chunk.readInt16LE(offset);
  });
};

Parser.readInt16BE = function (name) {
  this.next(name, 2, function (chunk, offset) {
    return chunk.readInt16BE(offset);
  });
};

Parser.readInt32LE = function (name) {
  this.next(name, 4, function (chunk, offset) {
    return chunk.readInt32LE(offset);
  });
};

Parser.readInt32BE = function (name) {
  this.next(name, 4, function (chunk, offset) {
    return chunk.readInt32BE(offset);
  });
};

Parser.readFloatLE = function (name) {
  this.next(name, 4, function (chunk, offset) {
    return chunk.readFloatLE(offset);
  });
};

Parser.readFloatBE = function (name) {
  this.next(name, 4, function (chunk, offset) {
    return chunk.readFloatBE(offset);
  });
};

Parser.readDoubleLE = function (name) {
  this.next(name, 8, function (chunk, offset) {
    return chunk.readDoubleLE(offset);
  });
};

Parser.readDoubleBE = function (name) {
  this.next(name, 8, function (chunk, offset) {
    return chunk.readDoubleBE(offset);
  });
};
