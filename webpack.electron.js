const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/ui/main.ts',
  target: 'electron-main',
  devtool: 'source-map',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/ui')
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      }
    ]
  },
  output: {
    hashFunction: 'xxhash64',
    path: path.resolve(__dirname, 'build/ui'),
    filename: 'main.js'
  }
};
