var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');
var babel = require('gulp-babel');

gulp.task( 'default', [ 'html', 'style', 'js', 'libraryJS' ] );

gulp.task( 'style', function() {
	gulp.src('node_modules/pikaday/css/pikaday.css')
		.pipe( minifycss() )
		.pipe( gulp.dest('../gh-pages/node_modules/pikaday/css/') );
	return gulp.src('css/*.css')
		.pipe( concat('main.min.css') )
		.pipe( minifycss() )
		.pipe( gulp.dest('../gh-pages/css/') );
});

gulp.task( 'js', function() {
	return gulp.src( 'js/*.jsx' )
		.pipe( concat('main.min.js') )
		.pipe( babel({
			presets: 'es2015'
		}) )
		.pipe( uglify() )
		.pipe( gulp.dest('../gh-pages/js/') );
});

gulp.task( 'libraryJS', function() {
	return gulp.src( ['node_modules/jquery/dist/jquery.min.js', 'node_modules/moment/min/moment.min.js', 'node_modules/pikaday/pikaday.js'] )
		.pipe( concat('all.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest('../gh-pages/node_modules/') );
});

gulp.task( 'html', function() {
	return gulp.src('index.html')
		.pipe( htmlReplace({
			'css': 'css/main.min.css',
			'js': 'js/main.min.js',
			'libraryJS': 'node_modules/all.min.js'
		}) )
		.pipe( gulp.dest('../gh-pages/') );
});