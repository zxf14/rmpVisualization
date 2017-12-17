const PATH = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const ROOT = '.';

const APP_FOLDER = PATH.resolve(__dirname, ROOT, 'app/');
const APP_ENTRY_FILE = PATH.resolve(__dirname, ROOT, APP_FOLDER, 'client.js');

const BUILD_FOLDER = PATH.resolve(__dirname, ROOT, 'app/public/');
const PUBLIC_PATH = '/assets/';
const BUILD_FILE = '/js/app.js';

module.exports = {

    entry: {
        app: APP_ENTRY_FILE
    },
    output: {
        path: BUILD_FOLDER,
        publicPath: PUBLIC_PATH,
        filename: BUILD_FILE
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css!sass')
            },
            {
                test: /\.(otf|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000&name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader?limit=8192&name=img/[name].[ext]'
            }
        ]
    },
    externals: {
        'react': 'React',
        'react-router': 'ReactRouter',
        'react-dom': 'ReactDOM'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: false,
            compress: {
                warnings: false
            },
            mangle: {
                except: ['$super', '$', 'exports', 'require', 'TableHeader', 'TableBody']
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin("/css/style.css")
        // new webpack.optimize.CommonsChunkPlugin('/js/init.js')
    ]
};
