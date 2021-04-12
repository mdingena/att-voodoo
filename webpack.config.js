const path = require('path');
const electronConfig = require('./webpack.electron.js');
const reactConfig = require('./webpack.react.js');

module.exports = [
  electronConfig,
  reactConfig
];