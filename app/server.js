import express from 'express';
import compression from 'compression';
import PATH from 'path';
import nconf from 'nconf';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import React from 'react';
import httpProxy from 'http-proxy';

var app = express();

const ROOT = "./";
const defaultConfig = PATH.resolve(__dirname, ROOT, 'config/default.json');
nconf.argv().env().file({file: defaultConfig});

// remove X-Powered-By
app.set('x-powered-by', false);

// set view engine
app.set('views', PATH.resolve(__dirname, ROOT, nconf.get('viewRoot')));
app.set('view engine', 'hbs');

app.use(compression());

// Register Node.js middleware
app.use(cookieParser());

const staticFolders = nconf.get('staticFolders');
const adjustedFolders = staticFolders.map(folder => PATH.resolve(__dirname, ROOT, folder));

adjustedFolders.forEach(folder => {
    app.use(nconf.get('staticFolderMount'), express.static(folder, {
        // maxAge: nconf.get('maxAge')
    }));
});

// Register api middleware
var apiProxy = httpProxy.createProxyServer({});
// apiProxy.on('proxyReq', function (proxyReq, req, res, options) {});
// apiProxy.on('proxyRes', function (proxyRes, req, res) {});
apiProxy.on('error', function (err, req, res) {
    res.status(500).send('Something went wrong. And we are reporting a custom error message.');
});

app.all('/test/*', function (req, res) {
    apiProxy.web(req, res, {target: 'http://localhost:8080/'});
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('*', (req, res) => {
    res.render('index');
});

app.listen(nconf.get('port'), () => {
    console.log(`App listening on port ${nconf.get('domain')}:${nconf.get('port')}`);
});