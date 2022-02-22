const fs = require('fs');
const dir_path = `${process.cwd()}`
const list = ['js', 'wxss', 'wxml', 'json']
const getFileType = (src) => {
    return new Promise((resolve, reject) => {
        // 获取文件状态
        fs.stat(src, (err, stat) => {
            if(err) {
                reject(err)
            }
            // 判断是文件
            if(stat.isFile()) {
                resolve('file')
            }else if (stat.isDirectory()){ // 判断是文件目录
                resolve('dir')
            }
        })
    })
}

const dirIsExist = (file_path) => {
    console.log('进来了', file_path);
    return new Promise((resolve, reject) => {
        fs.stat(file_path, (err, stat) => {
            // 判断文件夹是否存在
            if(stat && stat.isDirectory()) {
                resolve()
            }else {
                // 不存在就创建文件夹
                fs.mkdirSync(file_path, (err) => {
                    if(err) {
                        reject(err);
                    }
                    resolve()
                });
            }
          });
    })
}
// 
const createDir = (file_list, path) => {
    return new Promise((resolve, reject) => {
        file_list.forEach(async fileName => {
            let filePath = path+='/'+fileName;
            await dirIsExist(filePath);
         })
         resolve();
    })
}
// 写入文件
const writeFile = (fileName, path, str) => {
    return new Promise((resolve, reject) => {
         fs.writeFile(`${path}/${fileName}`, str, (err, data) => {
             if(err){
                 reject(err)
             }
             resolve()
         })
     })
 }
module.exports = {getFileType, dirIsExist, writeFile, createDir, dir_path, list}