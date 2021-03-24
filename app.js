const path = require('path');
const express = require('express');
const webpack = require('webpack');
const app = express();

// Webpack serving middleware
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(express.json());

// Serving static files
// app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

// Serving models
app.use('/models', express.static(path.join(__dirname, './models/')));

// Serving webpack build
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// Render the main page
app.get('/', (req, res) => {
  res.render('public/index.html');
})

app.listen(3000);