/**
 * @typedef {Object} Configuration
 * @property {String} coverageEnvVar - name of environment variable for coverage
 * @property {String} coverageFolder - directory in which to write coverage to
 * @property {Array<String>} excludes - list of glob paths to exclude
 * @property {Array<String>} reporters - list of reporters
 */

'use strict';

var extend = require('extend');
var fs = require('fs');
var path = require('path');

/**
 * Get configuration for a project, falling back to default configuration if
 * project does not provide a configuration of its own
 * @param {String} root - root path of project
 * @returns {Configuration} configuration to use for project
 */
function config(root) {
  var configFile = path.join(root, 'config', 'coverage.js');
  var defaultConfig = getDefaultConfig();

  if (fs.existsSync(configFile)) {
    var projectConfig = require(configFile);
    // over coverageFolder with env variable
    if (projectConfig.coverageFolderEnvVar && process.env[projectConfig.coverageFolderEnvVar]) {
      projectConfig.coverageFolder = process.env[projectConfig.coverageFolderEnvVar];
    }
    return extend({}, defaultConfig, projectConfig);
  }

  return defaultConfig;
}

/**
 * Get default configuration
 * @returns {Configuration} default configuration
 */
function getDefaultConfig() {
  return {
    coverageEnvVar: 'COVERAGE',
    coverageFolderEnvVar: 'COVERAGE_DIR',
    coverageFolder: 'coverage',
    excludes: [
      '*/mirage/**/*'
    ],
    useBabelInstrumenter: false,
    reporters: [
      'html',
      'lcov'
    ]
  };
}

module.exports = config;
