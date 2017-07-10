var trimlines = require('../');
var should = require('should');
var assert = require('stream-assert');
var testStream = require('./test-stream');
var gulp = require('gulp');

require('mocha');

var test = function (src, dest, done, options) {
  testStream(src)
    .pipe(trimlines(options || {}))
    .pipe(assert.first(function (d) { d.contents !== null ? d.contents.toString().should.eql(dest) : should.equal(src, d.contents); }))
    .pipe(assert.end(done));
};

describe('gulp-trimlines', function() {
  describe('trimlines()', function() {
    it('should handle empty files with default options', function (done) {
      test('', '', done);
    });

    it('should handle empty files with explicit options', function (done) {
      test('', '', done, {leading: true, trailing: true});
    });

    it('should handle empty lines with default options', function (done) {
      test('\n\n\n', '\n\n\n', done);
    });

    it('should handle empty lines with explicit options', function (done) {
      test('\n\n\n', '\n\n\n', done, {leading: true, trailing: true});
    });

    it('should handle both leading and trailing spaces and tabs', function (done) {
      test(' \t foo  \n  \t  bar    \n', 'foo\nbar\n', done);
    });

    it('should ignore both leading and trailing spaces and tabs when both set to false', function (done) {
      test(' \t foo  \n  \t  bar    \n', ' \t foo  \n  \t  bar    \n', done, {leading: false, trailing: false});
    });

    it('should ignore both leading and trailing hashes without an explicit patterns', function (done) {
      test('##foo##\n####bar####\n', '##foo##\n####bar####\n', done);
    });

    it('should handle both leading and trailing hashes with an explicit leading and trailing patterns', function (done) {
      test('##foo##\n####bar####\n', 'foo\nbar\n', done, {leadingPattern: '#+', trailingPattern: '#+'});
    });

    it('should handle both leading and trailing hashes with an explicit pattern', function (done) {
      test('##foo##\n####bar####\n', 'foo\nbar\n', done, {pattern: '^#+|#+$'});
    });

    it('should handle just leading spaces and tabs', function (done) {
      test(' \t foo \t \n \t   bar \t   \n', 'foo \t \nbar \t   \n', done, {trailing: false});
    });

    it('should handle just leading hashes with an explicit leading pattern', function (done) {
      test('##foo##\n####bar####\n', 'foo##\nbar####\n', done, {trailing: false, leadingPattern: '#+'});
    });

    it('should handle just trailing spaces and tabs', function (done) {
      test(' \t foo \t \n \t   bar \t   \n', ' \t foo\n \t   bar\n', done, {leading: false});
    });

    it('should handle just trailing hashes with an explicit trailing pattern', function (done) {
      test('##foo##\n####bar####\n', '##foo\n####bar\n', done, {leading: false, trailingPattern: '#+'});
    });

    it('should handle null buffer contents', function (done) {
      test(null, null, done);
    });
  });
});
