const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let os = require('os');
let interfaces = [];
Object.values(os.networkInterfaces()).forEach(v=>interfaces = interfaces.concat(v));
let interface = interfaces.find(v=>!v.internal)

module.exports = {
    mode: 'development',
  entry: './src/game.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  devServer: {
    host: interface.address,
    //static: {
    //  directory: path.join(__dirname, 'public'),
    //},
    //compress: true,
    port: 8080,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'game.js',
    path: path.resolve(__dirname, 'dist'),
  },
};