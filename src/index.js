var gulp = require('gulp');
var jslint = require('gulp-jslint');
var gncd = require('gulp-npm-copy-deps');
var zip = require('gulp-zip');
var del = require('del');

module.exports = function(options) {
	
	var _src = options.src;
	var _dest = options.dest;

	var package_json = require('./package.json');
	// console.log(">> package_json " + JSON.stringify(package_json));

	gulp.task('pal-clean-dist', function() {
		return del([ _dest+'/**/*', './'+_dest ]);
	});

	gulp.task('pal-jshint', [ 'pal-clean-dist' ], function() {
		return gulp.src([ '*.js', _src + '/**/*.js' ]).pipe(jshint());
	});

	gulp.task('pal-copy-npm-deps-into-tmp', [ 'clean-dist', 'pal-jshint' ], function() {
		return gncd('./',  '.'+_dest+'/tmp');
	});

	gulp.task('pal-copy-src-files-into-tmp', [ 'clean-dist', 'pal-jshint' ], function() {
		var src_files = package_json.main;
		return gulp.src(src_files, {base : "./"+_src}).pipe(gulp.dest('./'+_dest+'/tmp'));
	});

	// Zip Task
	gulp.task('pal-zip-files', [ 'clean-dist', 'pal-jshint',
			'copy-src-files-into-tmp', 'copy-npm-deps-into-tmp' ], function() {
		// copy the src files
		var src_files = package_json.main;
		var zip_filename = 'index.zip';

		var _task = gulp.src([ '*' ], { base : "./"+_dest+"/tmp"})
			.pipe(zip(zip_filename)).pipe(gulp.dest(_dest));
		
		return _task;
	});

	// // Export Task
	var expTask = gulp.task('package-aws-lambda', [ 'clean-dist', 'pal-jshint',
			'copy-src-files-into-tmp', 'copy-npm-deps-into-tmp',
			'pal-zip-files' ]);
	return expTask;

};
