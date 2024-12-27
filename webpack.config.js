const path = require('path')

const srcPath = path.resolve(__dirname, 'src')

module.exports = env => ({
  mode: env.production ? 'production' : 'development',
  devtool: env.production ? undefined : 'eval-source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  entry: {
    'public/js/script': [`${srcPath}/public/ts/script`],
  },

  output: {
    filename: '[name].js',
  },
})
