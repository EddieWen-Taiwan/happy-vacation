module.exports = {
	entry: './js/main.js',
	output: {
		path: __dirname,
		filename: 'build/bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		],
		noParse: [/moment/]
	},
	resolve: {
		alias: {
			moment: 'moment/min/moment.min.js'
		}
	}
}
