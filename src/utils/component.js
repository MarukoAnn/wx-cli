const fs = require('fs');
const path = require('path');
const common = require('./common')
// 获取当前执行cli的文件目录
let dir_path = common.dir_path;
const list = common.list;
const component = async (data) => {
    const {name, dir} = data;
    console.log('data', data);
     // 设置文件路径
     const file_path = path.join(dir_path, `${dir}/${name}`);
     let file_list = `${dir}/${name}`.split('/');
     try {
        common.createDir(file_list, dir_path);
         // 循环设置读写文件
        setTimeout(() => {
            list.forEach( async (val) => {
                let  data = await getTemplateContent(val, name);
                await common.writeFile(`${name}.${val}`, file_path, data);
            })
        }, 100)
     }catch (err) {
         console.log('err', err);
     }
}
// 获取模板
const getTemplateContent = async (type, name) => {
    let result = '';
    switch(type){
        case 'js': result = await readFile();result = `// components/${name}/${name}.js\n` + result;break;
        case 'wxss': result = `/* components/${name}/${name}.wxss */`;break;
        case 'json': result = `{"component": true,\t"usingComponents": {}}`;break;
        case 'wxml': result = `<!--components/${name}/${name}.wxml-->\n<text>components/${name}/${name}.wxml</text>`;break;
        default:
            break;
    }
    return result;
}
// 读取模板下的js文件。
const readFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../templates/component', 'index.js'), (err, data) => {
            if(err){
                reject(err);
            }
            // console.log('data', data.toString());
            resolve(data.toString());
        })
    })
    // return '123';
}

module.exports = component