const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const PORT = 3002;
const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(PORT, 'localhost', () => {
  console.log(`dev server listening on port ${PORT}...`);
});
