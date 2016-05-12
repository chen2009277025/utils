/**
 * Created by web on 15-7-30.
 */
var fs=require('fs');
var path = require('path');
var child_process = require('child_process');
var util = require('util');
/**
 * 当前目录创建循环目录
 * apath: 绝对地址或者相对地址
 * var s='/web/aa/bb/cc';
 *  filtUtil.mkdirsSync(s);
 */

var filtUtil={};

// '/dfs/dfsd/'
filtUtil.mkdirsSync = function (apath,mode){

        apath = path.normalize(apath);
        if(path.isAbsolute(apath)){
            if (!fs.existsSync(apath)) {
                var pathArr = apath.split(path.sep);
                pathArr.shift();
                if (pathArr[pathArr.length - 1] == "") {
                    pathArr.pop();
                }
                var dirPath = '/';
                for (var i = 0, l = pathArr.length; i < l; i++) {
                    dirPath = path.join(dirPath, pathArr[i]);
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath, mode);
                    }
                }
                return true;
            }
        }else{
            if (!fs.existsSync(apath)) {
                var pathtmp;
                apath.split(path.sep).forEach(function(dirname) {
                    if (pathtmp) {
                        pathtmp = path.join(pathtmp, dirname);
                    } else {
                        pathtmp = dirname;
                    }
                    if (!fs.existsSync(pathtmp)) {
                       fs.mkdirSync(pathtmp, mode);
                    }
                });
            }
            return true;
        }
}

//删除文件——
//fs.unlink(path[,callback])或者fs.unlinkSync(path)
//删除文件夹——
//方法1：使用递归

filtUtil.deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

//方法2：使用系统的命令
/* filtUtil.removeDir('/home/web/taa/',function(flag){
   console.log(flag);
   });
 */
filtUtil.removeDir = function(dirPath,callback){
    var exec = child_process.exec;
    var child;
    child = exec('rm -rf '+dirPath,  function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
            return callback(false);
        }else{
            return callback(true);
        }
    });
};

/*var s='/home/web/uploadCode/通道1';
deleteFolderRecursive(s);*/



module.exports = filtUtil;