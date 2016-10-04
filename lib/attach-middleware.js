'use strict';

var bodyParser = require('body-parser');
var Istanbul = require('istanbul');
var config = require('./config');
var path = require('path');
var fs = require('fs-extra');

function logError(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

module.exports = function(app, options) {
  var collector = new Istanbul.Collector();
  var _config = config(options.root);
  var reporter = new Istanbul.Reporter(null, path.join(options.root, _config.coverageFolder));
  var sync = false;
  var hash = [];

  app.post('/write-coverage',
    bodyParser.json({ limit: '50mb' }),
    function(req, res) {
      var query = req.query;
      collector.add(req.body);
      res.send({});
      var split = query['_split'] || 0;
      if (split) {
        hash.push(query['_partition']);
      }
      if (hash.length === Number(split)) {
        if (_config.reporters.indexOf('json-summary') === -1) {
          _config.reporters.push('json-summary');
        }
        reporter.addAll(_config.reporters);
        reporter.write(collector, sync, function() {
        });
      }
    },
    logError);
};
