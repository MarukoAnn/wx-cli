const fs = require('fs');
const common = require('./common');
const copyDir = async (orgin, path) => {
    try {
        await isExistSync(path)
    }catch (err) {
        fs.mkdirSync(path)
    }
    const allPaths = fs.readdirSync(orgin)
    allPaths.forEach(async (f_path) => {
        // 获取模板源地址
        const src = `${orgin}/${f_path}`
        // 获取目标地址
        const dest_path = `${path}/${f_path}`
        const file_type = await common.getFileType(src)
        if(file_type === 'file') {
            fs.writeFileSync(dest_path, fs.readFileSync(src))
        }else if(file_type === 'dir'){
            copyDir(src, dest_path)
        }
    })
    
}

const isExistSync = (path) => {
    fs.accessSync(path)
}

// const getFileType = (src) => {
//     return new Promise((resolve, reject) => {
//         // 获取文件状态
//         fs.stat(src, (err, stat) => {
//             if(err) {
//                 reject(err)
//             }
//             // 判断是文件
//             if(stat.isFile()) {
//                 resolve('file')
//             }else if (stat.isDirectory()){ // 判断是文件目录
//                 resolve('dir')
//             }
//         })
//     })
// }

module.exports = copyDir