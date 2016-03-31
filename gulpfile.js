var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');
var babel = require('gulp-babel');
var connect = require('gulp-connect');

var __targte_path__ = '../gh-pages/';

gulp.task( 'default', [ 'html', 'style', 'js' ] );

gulp.task( 'server', function() {
	connect.server();
});

gulp.task( 'style', function() {
	var pika = 'node_modules/pikaday/css/pikaday.css';
	var fc = 'node_modules/fullcalendar/dist/';
	return gulp.src([pika, fc+'fullcalendar.min.css', fc+'/fullcalendar.print.css', 'css/reset.css', 'css/main.css'])
		.pipe( concat('all.min.css') )
		.pipe( minifycss() )
		.pipe( gulp.dest(__targte_path__+'css/') );
});

gulp.task( 'js', function() {
	return gulp.src( 'js/bundle.js' )
		.pipe( concat('bundle.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest(__targte_path__+'js/') );
});

gulp.task( 'html', function() {
	const r = Math.floor(Math.random()*1000);
	return gulp.src('index.html')
		.pipe( htmlReplace({
			'css': 'css/all.min.css',
			'js': `js/bundle.min.js?r=${r}`
		}) )
		.pipe( gulp.dest(__targte_path__) );
});
