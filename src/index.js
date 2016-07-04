var gulp = require('gulp');
var jshint = require('gulp-jshint');
var gncd = require('gulp-npm-copy-deps');
var zip = require('gulp-zip');
var del = require('del');


var _addPrefixToPaths = function(pathsList, pathPrefix){
	for(i in pathsList){
		pathsList[i] =  pathPrefix + "/"+pathsList[i];
	} 
}; 


module.exports = function(gulp, options) {
	
	var cwd = process.cwd();  
	var _src = cwd +'/'+ options.src; 
	var _dest = cwd +'/'+ options.dest;   
	
	
	gulp.task('pal-clean-dist', function() {
		return del([ _dest+'/**/*',  _dest ]);
	});

	gulp.task('pal-jshint', [ 'pal-clean-dist' ], function() { 
		return gulp.src([ '*.js', _src + '/**/*.js' ]).pipe(jshint()); 
	});

	gulp.task('pal-copy-npm-deps-into-tmp', [ 'pal-clean-dist', 'pal-jshint' ], function() {
		return gncd(cwd, _dest+'/tmp');
	});
	
	gulp.task('pal-copy-src-files-into-tmp', [ 'pal-clean-dist', 'pal-jshint' ], function() {  
		// clone object
		var _srcFiles = JSON.parse(JSON.stringify(options.srcFiles)); 
		_addPrefixToPaths(_srcFiles, options.src );
		return gulp.src(_srcFiles, {base: _src}).pipe(gulp.dest( _dest+'/tmp'));
	});

	// Zip Task
	gulp.task('pal-zip-files', ['pal-copy-src-files-into-tmp', 'pal-copy-npm-deps-into-tmp' ], function() {
		// clone object
		var zipSrcFiles = JSON.parse(JSON.stringify(options.srcFiles)); 
		zipSrcFiles.push('node_modules/**/*');
		_addPrefixToPaths(zipSrcFiles, options.dest+"/tmp");
		
		var zip_filename = 'index.zip'; 
		var _zipBase = "./"+ options.dest +"/tmp";
		
		console.log("src_files: "+zipSrcFiles + "; _zipBase: "+_zipBase); 
		
		var _task = gulp.src(zipSrcFiles, {base: _zipBase})
			.pipe(zip(zip_filename))
			.pipe(gulp.dest(_dest)); 
		return _task;
	});
	
	
	return function(){
		gulp.start(['pal-clean-dist', 'pal-jshint', 'pal-copy-npm-deps-into-tmp', 'pal-copy-src-files-into-tmp', 
					 'pal-zip-files']);
		console.log("package-aws-lambda completed");
	};
}; 