
# barse

Binary parser with a fluent API.

## Usage

```js
var parse = require('barse');

var parser = parse()
  .next('foo', 3, function (chunk, offset) {
    return chunk.toString('utf8', offset, offset + 3);
  })
  .next('bar', 3, function (chunk, offset) {
    return chunk.toString('utf8', offset, offset + 3);
  });

parser.on('data', console.log);
// => { foo : foo, bar : bar }

parser.write(new Buffer('fo'));
parser.write(new Buffer('ob'));
parser.write(new Buffer('ar'));
```

## API

### parse()

Create a new streaming parser.

### parse#next(name, length, fn)

Consume a chunk of binary data with the given `length`.

`fn` is called with the current `chunk` and `offset` and is expected to synchronously return the parsed Object/String/whatever, which then will be emitted under `name` in the results object.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install barse
```

## License

The MIT License (MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.