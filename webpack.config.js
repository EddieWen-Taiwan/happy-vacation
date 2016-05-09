const path = require('path');

module.exports = {
	entry: path.resolve(__dirname, 'src', 'app.js'),
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.js$/, include: /src/, loader: 'babel-loader' },
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.(png|jpg)$/, loader: 'file-loader?name=img/[hash:7].[ext]' }
		],
		noParse: [/moment/]
	},
	resolve: {
		root: path.resolve(__dirname, 'src'),
		extensions: ['', '.js'],
		alias: {
			moment: 'moment/min/moment.min.js'
		}
	}
}
