const path = require('path')

module.exports = {
  context: __dirname,
  entry: './client/index.jsx',
  output: {
    path: path.join(__dirname, '/client/public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ]
  }
}
