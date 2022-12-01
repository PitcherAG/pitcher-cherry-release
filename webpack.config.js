/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path')
// const webpack = require('webpack')

const plugins = [
  // new webpack.ProvidePlugin({
  // }),
]

module.exports = {
  entry: './src/main.ts',
  plugins,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'pitcher-cherry-release.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
