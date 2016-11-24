module.exports = {
	entry: './app/index.js',
	output: {
		filename: 'bundle.js',
		path: './dist'
	},
	devtool: "cheap-module-eval-source-map",
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}]
	},
	devServer: {
		publicPath: "http://localhost:3033/dist/"
	}
};
