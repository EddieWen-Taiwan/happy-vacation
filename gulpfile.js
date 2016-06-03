const gulp = require('gulp');
const htmlReplace = require('gulp-html-replace');

gulp.task( 'default', function() {

	gulp.src('build/**')
		.pipe( gulp.dest('../gh-pages/') );

	const tmp = Math.floor( Math.random()*573 );
	return gulp.src('build/index.html')
		.pipe( htmlReplace({
			'js': `bundle.js?v=${tmp}`
		}) )
		.pipe( gulp.dest('../gh-pages/') );

});
