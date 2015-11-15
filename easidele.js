var fs = require('fs');
var path = require('path');
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
        fs.stat(path.join(dPath,fileName), function(error, stat){
          if(condition && condition(stat)){
            fileList.push({path:file, name:fileName});
          }else{
            fileList.push({path:file, name:fileName});
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
  var next = arguments[1];
  var args = Array.prototype.slice.call(arguments, 2);

  getFilesOnCondition(dPath, function(stat){
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

module.exports = function(sPath, dPath){
  if(!sPath || !dPath || !fs.existsSync(sPath) || !fs.existsSync(dPath)){
    if(!sPath){
      console.error("ERR", "Please provide the source path");
    }
    if(!dPath){
      console.error("ERR", "Please provide the destination path");
    }
    if(!fs.existsSync(sPath)){
      console.log("ERR", "The source directory does not exist!");
    }
    if(!fs.existsSync(dPath)){
      console.log("ERR", "The destionation directory does not exist!");
    }
    process.exit(5);
  }

  if(sPath === dPath){
    console.error("ERR", "Please provide different path!");
    process.exit(5);
  }
  getSourceFileList(getDuplicatedFiles, finishedFunction);
}
