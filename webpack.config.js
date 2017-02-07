const path = require("path");
const webpack = require("webpack");

module.exports = {
    context: path.resolve(__dirname, "app"),
    entry: {
        "2d-election-map": "./2d-election-map.js",
        "aframe-hello-world": "./aframe-hello-world.js",
        "aframe-svg": "./aframe-svg.js",
        "aframe-state-map": "./aframe-state-map.js",
        "aframe-d3": "./aframe-d3.js",
        "vendor-head": [
            "aframe",
            "./lib/svgpath-component.js",
            "d3",
            "d3-selection",
            "topojson-client",
        ],
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "dist"),
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor-head", "manifest"],
            minChunks: Infinity,
            filename: "[name].js",
        }),
    ],
    devtool: "inline-source-map",
    module: {
        noParse: [
            /node_modules\/aframe\/dist\/aframe.js/,
            /node_modules\/aframe\/dist\/aframe-master.js/,
        ],
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
        }],
    },
    devServer: {
        publicPath: "http://localhost:3033/dist/",
        contentBase: [path.join(__dirname, "www"), path.join(__dirname, "data")],
    },
};
