# gulp-package-aws-lambda

Gulp plugin to package the src js code plus all the "dependencies" inside a zip archive that can be deployed into lambda aws. 

## Get started

### Install

```
npm gulp-package-aws-lambda
```

### Examples

```javascript
var gulp = require('gulp');


// Specify the folders of your project (srcFiles inside the src folder) 
var options =  {"src": "src", "dest": "dist", "srcFiles": ["index.js"]};

// pass a gulp reference 
var packageAwsLambdaTask = require('gulp-package-aws-lambda')(gulp, options);

// exec the "task"
packageAwsLambdaTask();
	
```

