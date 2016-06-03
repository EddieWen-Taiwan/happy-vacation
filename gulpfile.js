const gulp = require('gulp');
const htmlReplace = require('gulp-html-replace');

gulp.task( 'default', function() {

	const tmp = Math.floor( Math.random()*721 );

	return gulp.src('build/index.html')
		.pipe( htmlReplace({
			'js': `bundle.js?v=${tmp}`
		}, {
			keepBlockTags: true
		}) )
		.pipe( gulp.dest('build') );

});
