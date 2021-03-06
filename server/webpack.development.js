import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import StyleguidePlugin from '../plugin/styleguide-plugin';
import autoprefixer from 'autoprefixer';

export default {
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname, '../src/index.js')
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        DISABLE_LOGGER: process.env.DISABLE_LOGGER,
      }
    }),
    new ExtractTextPlugin('bundle-[hash].css', { disable: true }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '../src/index.html'),
    }),
    new StyleguidePlugin({
      src: 'src/**/*.js'
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      // this is a hack for development
      // in the final version we compile it before shipping
      include: [path.join(__dirname, '../src'), path.join(__dirname, '../plugin')]
    }, {
      test: /\.scss/,
      loader: ExtractTextPlugin.extract('style',
      'css?modules&importLoaders=2&localIdentName=[name]-[local]!postcss-loader!sass'),
      include: path.join(__dirname, '../src')
    }, {
      test: /\.(png|jpg|gif)$/,
      loaders: ['url?limit=10000']
    }, {
      test: /\.(svg)$/,
      loaders: ['url?limit=0']
    }]
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
};
