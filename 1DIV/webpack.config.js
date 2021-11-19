const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ttf$/,
      use: ['file-loader']
    }]
  },
  plugins: [
    new MonacoWebpackPlugin({
      publicPath: '',
      features: ['!codelens', '!contextmenu', '!documentSymbols', '!gotoError', '!gotoLine', '!gotoSymbol', '!inspectTokens', '!quickHelp', '!quickOutline', '!snippets'],
      languages: ['css']
    })
  ]
};
