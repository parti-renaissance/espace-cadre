const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SentryPlugin = require('@sentry/webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

const localEnvPath = './.env.local'
const productionEnvPath = './.env.production'

module.exports = (env, argv = {}) => {
  const { parsed: dotenvConfig } = dotenv.config({
    path: argv.mode === 'development' ? localEnvPath : productionEnvPath,
  })
  return {
    entry: {
      bundle: './src/index.js',
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
        'process.env': JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
          REACT_APP_INTERNAL_APP_ID: process.env.REACT_APP_INTERNAL_APP_ID,
          REACT_APP_MAPBOX_STYLE: process.env.REACT_APP_MAPBOX_STYLE,
          REACT_APP_MAPBOX_TOKEN: process.env.REACT_APP_MAPBOX_TOKEN,
          REACT_APP_OAUTH_CLIENT_ID: process.env.REACT_APP_OAUTH_CLIENT_ID,
          REACT_APP_OAUTH_HOST: process.env.REACT_APP_OAUTH_HOST,
          REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
          REACT_APP_UNLAYER_PROJECT_ID: process.env.REACT_APP_UNLAYER_PROJECT_ID,
          REACT_APP_VERSION: process.env.REACT_APP_VERSION,
        }),
      }),
      new CopyPlugin({
        patterns: [{ from: 'public' }, { from: 'node_modules/leaflet/dist/images' }],
      }),
      new SentryPlugin({
        org: 'en-marche-i7',
        project: 'je-mengage',
        authToken: dotenvConfig.SENTRY_AUTH_TOKEN,
        release: dotenvConfig.REACT_APP_VERSION,
        include: './build',
        ignore: ['node_modules', 'webpack.config.js'],
        dryRun: argv.mode === 'development',
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        api: path.resolve(__dirname, 'src/api'),
        components: path.resolve(__dirname, 'src/components'),
        domain: path.resolve(__dirname, 'src/domain'),
        assets: path.resolve(__dirname, 'src/assets'),
        services: path.resolve(__dirname, 'src/services'),
        style: path.resolve(__dirname, 'src/style'),
        shared: path.resolve(__dirname, 'src/shared'),
        ui: path.resolve(__dirname, 'src/ui'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|svg)/,
          type: 'asset',
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      ],
    },
    devtool: argv.mode === 'development' ? 'source-map' : 'hidden-source-map',
    devServer: {
      static: path.resolve(__dirname, 'public'),
      open: dotenvConfig.CONFIG_DEV_SERVER_OPEN === 'true',
      port: 3000,
      historyApiFallback: true,
    },
  }
}
