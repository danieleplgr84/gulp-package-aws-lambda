var fs = require('fs'); 
var gulp = require('gulp');

//gulp.task('copy-npm-deps', function() {
//	return gulp.src(listDeps(), {base:'./'}).pipe(gulp.dest('./build'));
//});


var _add_dependency_to_list = function(_list, _dep_string){
	if(_list && _dep_string){
		var to_add_path_src = './node_modules/' + _dep_string + '/**/*'
		if(_list.indexOf(to_add_path_src) == -1){ 
			_list.push(to_add_path_src);
		}
	} 
};


var _pushDependenciesForModuleRecursively =function(_list, isRootModule, module_name){
	var package_json = null; 
	//console.log(">> Calling _pushDependenciesForModuleRecursively for "+module_name);
	
	if(isRootModule){
		var buffer = fs.readFileSync('./package.json');
		package_json = JSON.parse(buffer.toString());  
		//console.log(">> package_json >> " + JSON.stringify(package_json.dependencies));
	} 
	else {
		var buffer = fs.readFileSync('./node_modules/'+module_name+'/package.json');
		var child_package_json = JSON.parse(buffer.toString());   
		package_json = child_package_json;
		//console.log(">> child_package_json >> " + JSON.stringify(package_json.dependencies));
	}
	
	var dependencies_list = Object.keys(package_json.dependencies);
	//console.log(">> Found dependencies for module "+module_name+" >> " + JSON.stringify(dependencies_list ));
	
	if(dependencies_list && dependencies_list.length >0){ 
		for (index in dependencies_list) {
			var _dependency_mod_name = dependencies_list[index];
			if(_dependency_mod_name){
				_pushDependenciesForModuleRecursively(_list, false, _dependency_mod_name); 
				_add_dependency_to_list(_list, _dependency_mod_name); 
			} 
		} 
	}
	else {
		if(!isRootModule && module_name && typeof(module_name)==='string'){
			var to_add_path_src = './node_modules/' + module_name + '/**/*'
			_add_dependency_to_list(_list, module_name); 
		} 
	}
};


var listDeps = function(devDependencies, packageJsonFilePath) {  
  var keys = [];
  var isRootModule = true;
  
  _pushDependenciesForModuleRecursively(keys, isRootModule); 
  
  return keys;
};


module.exports = function(_base, _dest){
	return gulp.src(listDeps(), {base: _base}).pipe(gulp.dest(_dest));
};