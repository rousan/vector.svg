var array = require('stream-array');
var File = require('gulp-util').File;

module.exports = function () {
  var args = Array.prototype.slice.call(arguments);

  function create(contents) {
    return new File({
      contents: contents !== null ? new Buffer(contents) : null
    });
  }

  return array(args.map(create))
};
