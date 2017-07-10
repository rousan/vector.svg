var through = require('through2');

function gulpTrimLines(options) {
  var leadingPattern, trailingPattern, patterns, regex;

  // ensure the option defaults
  options = options || {};
  options.leading = options.hasOwnProperty('leading') ? !!options.leading : true;
  options.trailing = options.hasOwnProperty('trailing') ? !!options.trailing : true;
  options.leadingPattern = options.leadingPattern || '[ \\t]+';
  options.trailingPattern = options.trailingPattern || '[ \\t]+';
  options.encoding = options.encoding || 'utf8';

  // create the regex
  if (options.pattern) {
    regex = new RegExp(options.pattern, 'gm');
  }
  else {
    patterns = [];
    if (options.leading) {
      patterns.push('^' + options.leadingPattern);
    }
    if (options.trailing) {
      patterns.push(options.trailingPattern + '$');
    }
    regex = patterns.length > 0 ? new RegExp(patterns.join('|'), 'gm') : null;
  }

  return through.obj(function(file, encoding, done) {
    if (regex && (file.contents !== null)) {
      file.contents = new Buffer(file.contents.toString(options.encoding).replace(regex, ""));
    }
    this.push(file);
    return done();
  });
};

module.exports = gulpTrimLines;
