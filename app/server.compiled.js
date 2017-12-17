'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nconf = require('nconf');

var _nconf2 = _interopRequireDefault(_nconf);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var ROOT = "./";
var defaultConfig = _path2.default.resolve(__dirname, ROOT, 'config/default.json');
_nconf2.default.argv().env().file({ file: defaultConfig });

// remove X-Powered-By
app.set('x-powered-by', false);

// set view engine
app.set('views', _path2.default.resolve(__dirname, ROOT, _nconf2.default.get('viewRoot')));
app.set('view engine', 'hbs');

app.use((0, _compression2.default)());

// Register Node.js middleware
app.use((0, _cookieParser2.default)());

var staticFolders = _nconf2.default.get('staticFolders');
var adjustedFolders = staticFolders.map(function (folder) {
    return _path2.default.resolve(__dirname, ROOT, folder);
});

adjustedFolders.forEach(function (folder) {
    app.use(_nconf2.default.get('staticFolderMount'), _express2.default.static(folder, {
        // maxAge: nconf.get('maxAge')
    }));
});

// Register api middleware
var apiProxy = _httpProxy2.default.createProxyServer({});
// apiProxy.on('proxyReq', function (proxyReq, req, res, options) {});
// apiProxy.on('proxyRes', function (proxyRes, req, res) {});
apiProxy.on('error', function (err, req, res) {
    res.status(500).send('Something went wrong. And we are reporting a custom error message.');
});

app.all('/test/*', function (req, res) {
    apiProxy.web(req, res, { target: 'http://localhost:8080/' });
});

app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

app.get('*', function (req, res) {
    res.render('index');
});

app.listen(_nconf2.default.get('port'), function () {
    console.log('App listening on port ' + _nconf2.default.get('domain') + ':' + _nconf2.default.get('port'));
});
