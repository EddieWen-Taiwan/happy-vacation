var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var htmlReplace = require('gulp-html-replace');

gulp.task( 'default', [ 'html', 'style', 'js', 'libraryJS' ] );

gulp.task( 'style', function() {
	return gulp.src('css/*.css')
		.pipe( concat('main.min.css') )
		.pipe( minifycss() )
		.pipe( gulp.dest('../gh-pages/css/') );
});

gulp.task( 'js', function() {
	return gulp.src(['js/holiday.js', 'js/main.js'])
		.pipe( concat('main.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest('../gh-pages/js/') );
});

gulp.task( 'libraryJS', function() {
	return gulp.src(['library/jquery.min.js', 'library/moment/moment.min.js', 'library/Pikaday/pikaday.js'])
		.pipe( concat('all.min.js') )
		.pipe( uglify() )
		.pipe( gulp.dest('../gh-pages/library/') );
});

gulp.task( 'html', function() {
	return gulp.src('index.html')
		.pipe( htmlReplace({
			'css': 'css/main.min.css',
			'js': 'js/main.min.js',
			'libraryJS': 'library/all.min.js'
		}) )
		.pipe( gulp.dest('../gh-pages/') );
});
