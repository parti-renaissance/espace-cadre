const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const DotenvFlow = require('dotenv-flow-webpack')

module.exports = (env, argv = {}) => {
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
      new DotenvFlow(),
      new CopyPlugin({
        patterns: [{ from: 'public' }, { from: 'node_modules/leaflet/dist/images' }],
      }),
    ],
    resolve: {
      extensions: ['.js'],
      alias: {
        api: path.resolve(__dirname, 'src/api'),
        components: path.resolve(__dirname, 'src/components'),
        domain: path.resolve(__dirname, 'src/domain'),
        providers: path.resolve(__dirname, 'src/providers'),
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
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.woff2$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    devtool: argv.mode === 'development' ? 'source-map' : 'hidden-source-map',
    devServer: {
      static: path.resolve(__dirname, 'public'),
      compress: true,
      port: 3000,
      historyApiFallback: true,
    },
  }
}
