const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = (process.env.NODE_ENV === 'production');

module.exports = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/, 'src/assets'],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            path: path.resolve(__dirname, 'dist'),
            filename: 'index.html',
            inject: 'head'
        }),
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }])
    ],
    externals: {
        aframe: {
            commonjs: "aframe",
            amd: "aframe",
            root: "AFRAME" // global variable
        }
    }
};
