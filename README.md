# gulp-npm-copy-deps

Gulp plugin for copying package.json dependencies recursively into a target dir

## Get started

### Install

```
npm install gulp-npm-copy-deps
```

### Examples

```javascript
var gulp = require('gulp');
var gncd = require('gulp-npm-copy-deps');

// Copy dependencies to build/node_modules/
gulp.task('copy-npm-deps', function() {
	return gncd('./', './build');
});  
```

