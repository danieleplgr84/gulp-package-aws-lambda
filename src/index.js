var fs = require('fs'); 
var gulp = require('gulp');
var jslint = require('gulp-jslint');
var gncd = require('gulp-npm-copy-deps');


module.exports = function(){

  var package_json = require('./package.json'); 
  console.log(">> package_json " + JSON.stringify(package_json));

  
  
  gulp.task('pal-clean-dist', function () {
  	return del(['dist/**/*', './dist']);
  }); 
  
  gulp.task('pal-jshint', ['pal-clean-dist'], function () { 
	  return gulp.src(['*.js', 'src/**/*.js']).pipe(jshint());
  });
  
  

  gulp.task('pal-copy-npm-deps-into-tmp', ['clean-dist', 'pal-jshint'], function() {
  	return gncd('./', './dist/tmp');
  }); 

  gulp.task('pal-copy-src-files-into-tmp', ['clean-dist', 'pal-jshint'], function() {
  	var src_files = package_json.main;
  	return gulp.src(src_files, {base: "./src"}) 
  		.pipe(gulp.dest('./dist/tmp'));
  });
  
  
  //Zip Task
  gulp.task('pal-zip-files', ['clean-dist', 'pal-jshint', 'copy-src-files-into-tmp', 'copy-npm-deps-into-tmp'], function() {
  	// copy the src files
  	var src_files = package_json.main; 
  	var zip_filename = 'index.zip';
  	
  	var _task = gulp.src(['*'], {base: "./dist/tmp"})
  		.pipe(zip(zip_filename))
  		.pipe(gulp.dest('dist'));
  	
  	return _task;
  });


  // Export Task
  gulp.task('package-aws-lambda', ['clean-dist', 'pal-jshint', 'copy-src-files-into-tmp', 'copy-npm-deps-into-tmp', 'pal-zip-files']);
  
  
};



