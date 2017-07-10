## Usage

```js
var trimlines = require('gulp-trimlines');

gulp.task('trim-text', function() {
  return gulp.src('*.txt')
    .pipe(trimlines())
    .pipe(gulp.dest('./'));
});
```

This will trim leading and trailing spaces in each text file in place.

## Options

You can pass an options object to gulp-trimlines.  The options have the following defaults:

1. *leading* use leading pattern on each line, defaults to true
2. *trailing* use trailing pattern on each line, defaults to true
3. *leadingPattern* regex string pattern for leading characters to trim, defaults to '[ \\\t]+' (spaces and tabs - note that tab has to be double escaped)
4. *trailingPattern* regex string pattern for trailing characters to trim, defaults to '[ \\\t]+' (spaces and tabs - note that tab has to be double escaped)
5. *pattern* regex string pattern for entire line, when present the *leading*, *leadingPattern*, *trailing* and *trailingPattern* options are ignored
6. *encoding* character encoding to use when loading file buffers, defaults to uft8

## Examples

### Trim only trailing spaces and tabs
```js
  .pipe(trimlines({
    leading: false
  }))
```

### Trim only trailing hash (#) characters
```js
  .pipe(trimlines({
    leading: false,
    trailingPattern: '#+'
  }))
```

## LICENSE

The MIT License (MIT)

Copyright (c) 2015 Doug Martin <http://dougmart.in>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
