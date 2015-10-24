var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var minifyCSS = require('gulp-minify-css');
var gargoyle = require('gargoyle');

var sassDir = 'assets/sass/';
var targetCSSDir = 'app/assets/css/';

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

function watcher(path, task, poll) {
	var options = {
		type: 'watchFile',
		interval: poll
	};
	gargoyle.monitor(path, options, function(err, monitor) {
		if(err) {
			console.log(err);
			return;
		}
		monitor.on('modify', function(filename) {gulp.start(task)});
		monitor.on('delete', function(filename) {gulp.start(task)});
		monitor.on('create', function(filename) {gulp.start(task)});
	});
}

gulp.task('css', function() {
	return gulp.src(sassDir + '**/*.scss')
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(sass())
		.pipe(autoprefix('last 10 versions'))
		.pipe(minifyCSS())
		.pipe(plumber.stop())
		.pipe(gulp.dest(targetCSSDir));
});

gulp.task('watch', function() {
	watcher(sassDir, 'css');
});

gulp.task('default', ['css']);
