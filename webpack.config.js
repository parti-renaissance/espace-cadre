const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = (env, argv = {}) => {
  dotenv.config({ path: argv.mode === 'development' ? './.env.local' : './.env.production' })

  return {
    entry: {
      bundle: './src/index.jsx',
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name]-[fullhash].js',
      publicPath: '/',
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
      }),
      new CleanWebpackPlugin({ verbose: true }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        api: path.resolve(__dirname, 'src/api'),
        components: path.resolve(__dirname, 'src/components'),
        domain: path.resolve(__dirname, 'src/domain'),
        services: path.resolve(__dirname, 'src/services'),
        style: path.resolve(__dirname, 'src/style'),
        ui: path.resolve(__dirname, 'src/ui'),
      },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      ],
    },
    devtool: argv.mode === 'development' ? 'source-map' : false,
    devServer: {
      static: path.resolve(__dirname, 'public'),
      open: true,
      port: 3000,
      historyApiFallback: true,
    },
  }
}
