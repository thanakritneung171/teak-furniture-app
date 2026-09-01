const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appDirectory = __dirname;

// Babel: use RN preset + react-native-web plugin, applied to app code AND the RN
// ecosystem packages that ship untranspiled JSX/Flow.
const babelLoaderConfiguration = {
  test: /\.[jt]sx?$/,
  // ให้ webpack มองผล babel (CJS) เป็น auto ไม่ใช่ ESM (กัน "exports is not defined"
  // ในแพ็กเกจที่ package.json เป็น type:module เช่น safe-area-context/lib/module)
  type: 'javascript/auto',
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native-web'),
    path.resolve(appDirectory, 'node_modules/@react-navigation'),
    path.resolve(appDirectory, 'node_modules/react-native-screens'),
    path.resolve(appDirectory, 'node_modules/react-native-safe-area-context'),
    path.resolve(appDirectory, 'node_modules/@react-native-async-storage'),
    path.resolve(appDirectory, 'node_modules/react-native-image-picker'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      babelrc: false,
      configFile: false,
      // RN preset จัดการ Flow/TS/JSX ต่อไฟล์ (แบบ Metro); บังคับ CJS ให้สม่ำเสมอ
      // + react-native-web plugin (rewrite react-native → react-native-web)
      presets: ['module:@react-native/babel-preset'],
      plugins: ['react-native-web'],
    },
  },
};

// node_modules ที่ ship เป็น ESM (@react-navigation ฯลฯ) ต้องปิด fullySpecified
const esmResolveFix = {
  test: /\.m?js$/,
  resolve: { fullySpecified: false },
};

const assetLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg|ttf|woff2?)$/,
  type: 'asset/resource',
};

module.exports = (env, argv) => {
  const isProd = argv && argv.mode === 'production';
  return {
    // เลี่ยง devtool แบบ eval (ทำให้ CJS `exports` พังใน strict scope)
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    entry: path.resolve(appDirectory, 'index.web.js'),
    output: {
      path: path.resolve(appDirectory, 'dist-web'),
      filename: isProd ? 'bundle.[contenthash].js' : 'bundle.js',
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
      alias: { 'react-native$': 'react-native-web' },
    },
    module: { rules: [esmResolveFix, babelLoaderConfiguration, assetLoaderConfiguration] },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(appDirectory, 'public/index.html') }),
      new CopyWebpackPlugin({
        patterns: [{ from: 'public/fonts', to: 'fonts' }],
      }),
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProd),
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      }),
    ],
    devServer: {
      historyApiFallback: true,
      port: 8080,
      host: '0.0.0.0',
      static: { directory: path.resolve(appDirectory, 'public') },
    },
  };
};
