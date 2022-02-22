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


module.exports = copyDir