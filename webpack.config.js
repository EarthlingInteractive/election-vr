const path = require("path");

module.exports = {
    context: path.resolve(__dirname, "app"),
    entry: {
        "2d-election-map": "./2d-election-map.js",
        "aframe-hello-world": "./aframe-hello-world.js",
        "aframe-svg": "./aframe-svg.js",
    },
    output: {
        filename: "[name].js",
        path: "./dist",
    },
    devtool: "inline-source-map",
    module: {
        noParse: [
            /node_modules\/aframe\/dist\/aframe.js/,
            /node_modules\/aframe\/dist\/aframe-master.js/,
        ],
        loaders: [{
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
