var fs = require('fs');
var path = require('path');
var sPath="";
var dPath="";
/**
 * Get the files on certain condition
 * @param  {path}   directoryPath where the
 * @param  {function}   condition     The filter for returned files
 * @param  {Function} callback      once done, we'll call this function
 * @return {Array}                 a list of file object which contains the path and name of the file
 */
function getFilesOnCondition(directoryPath, condition, callback){
    //TODO: need add the error handler
    fs.readdir(directoryPath, function(err, files){
      var fileList = [];
      files.forEach(function (fileName, index, array) {
        var file = path.join(dPath,fileName);
        fs.stat(file, function(error, stat){
          if(condition){
            if(condition(fileName, stat)){
              fileList.push({path:file, name:fileName});              
            }
          }else{
            fileList.push(JSON.stringify({name:fileName, birthtime: stat.birthtime}));
          }
          if(index === array.length - 1){
            callback(fileList);
          }
        });
      });
    });
};

/**
 * Get the file list from the source directory
 */
function getSourceFileList(){
  var next = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  getFilesOnCondition(sPath, false, function(filesList){
    args.unshift(filesList)
    next.apply(null, args);
  });
}


/**
 * Get the file list from the destination directory
 */
function getDuplicatedFiles(keys){
  console.log(keys);
  var next = arguments[1];
  var args = Array.prototype.slice.call(arguments, 2);
  getFilesOnCondition(dPath, function(fileName, stat){
      return (keys.indexOf(JSON.stringify({name:fileName, birthtime: stat.birthtime})) !== -1);
  }, function(filesList){
    args.unshift(filesList)
    next.apply(null, args);
  });
}


/**
 * Will be called once the action is done
 */
function finishedFunction (){
  files = arguments[0];
  files.forEach(function (file, index, arr) {
    console.log("deleting:", file.name);
    fs.unlink(file.path, function(err){
      if(!err){
        console.log("deleted:", file.name);
      }
    });
  });
}

module.exports = function(fromPath, toPath){
  if(!fromPath || !toPath || !fs.existsSync(fromPath) || !fs.existsSync(toPath)){
    if(!fromPath){
      console.error("ERR", "Please provide the source path");
    }
    if(!toPath){
      console.error("ERR", "Please provide the destination path");
    }
    if(!fs.existsSync(fromPath)){
      console.log("ERR", "The source directory does not exist!");
    }
    if(!fs.existsSync(toPath)){
      console.log("ERR", "The destionation directory does not exist!");
    }
    process.exit(5);
  }

  if(fromPath === toPath){
    console.error("ERR", "Please provide different path!");
    process.exit(5);
  }

  sPath = fromPath;
  dPath = toPath;
  getSourceFileList(getDuplicatedFiles, finishedFunction);
}
