const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/ui/renderer.tsx',
  target: 'electron-renderer',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist/ui/renderer.js'),
    compress: true,
    port: 9001
  },
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
      },
      {
        test: /\.ttf$/i,
        type: 'asset/resource',
        dependency: { not: ['url'] }
      },
      {
        test: /\.png$/i,
        type: 'asset/resource'
      },
      {
        test: /\.wav$/i,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/
      }
    ]
  },
  output: {
    hashFunction: 'xxhash64',
    path: path.resolve(__dirname, 'build/ui'),
    filename: 'renderer.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui/index.html'
    })
  ]
};
