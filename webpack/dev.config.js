const path = require('path'); //eslint-disable-line
const webpack = require('webpack'); //eslint-disable-line

const host = 'localhost';
const port = 3000;
const customPath = path.join(__dirname, './customPublicPath');
const hotScript = 'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';

const baseDevConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  entry: {
    app: [customPath, hotScript, path.join(__dirname, '../chrome/extension/app')],
    background: [customPath, hotScript, path.join(__dirname, '../chrome/extension/background')],
    options: [customPath, hotScript, path.join(__dirname, '../chrome/extension/options')],
  },
  devMiddleware: {
    publicPath: `http://${host}:${port}/js`,
    stats: {
      colors: true,
    },
    noInfo: true,
  },
  hotMiddleware: {
    path: '/js/__webpack_hmr',
  },
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      { test: /\.(woff(2)?|ttf|eot)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=1' },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react-hmre'],
        },
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss',
        ],
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader',
      },
    ],
  },
});

const injectPageConfig = baseDevConfig();

injectPageConfig.entry = [ //eslint-disable-line
  customPath,
  path.join(__dirname, '../chrome/extension/inject'),
];
delete injectPageConfig.hotMiddleware; //eslint-disable-line
delete injectPageConfig.module.loaders[0].query; //eslint-disable-line
injectPageConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectPageConfig.output = { //eslint-disable-line
  path: path.join(__dirname, '../dev/js'),
  filename: 'inject.bundle.js',
};
const appConfig = baseDevConfig();

module.exports = [ //eslint-disable-line
  injectPageConfig,
  appConfig,
];
