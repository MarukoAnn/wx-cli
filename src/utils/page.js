const fs = require('fs');
const path = require('path');
const common = require('./common')
// 获取当前执行cli的文件目录
let dir_path = common.dir_path;
const list = common.list;
const page = async (data) => {
    const {name, dir} = data;
    // 设置文件路径
    const file_path = path.join(dir_path, `${dir}/${name}`);
    
    let file_list = `${dir}/${name}`.split('/');
     try {
        readRouterFile(dir_path, name, file_path)

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
        case 'js': result = await readFile();result = `// pages/${name}/${name}.js\n` + result;break;
        case 'wxss': result = `/* pages/${name}/${name}.wxss */`;break;
        case 'json': result = `{"usingComponents": {}}`;break;
        case 'wxml': result = `<!--pages/${name}/${name}.wxml-->\n<text>pages/${name}/${name}.wxml</text>`;break;
        default:
            break;
    }
    return result;
}
// 读取模板下的js文件。
const readFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../templates/page', 'index.js'), (err, data) => {
            if(err){
                console.log(err);
                reject(err);
            }
            // console.log('data', data.toString());
            resolve(data.toString());
        })
    })
    // return '123';
}

// 读取路由文件
const readRouterFile = (path, name, file_path) => {
    // console.log('path', path);
    const all_path  = fs.readdirSync(path)
    // 查找文件下的app.json文件
    if(all_path.some(val => val === 'app.json')) {
        let appPath = all_path.reduce((acc, curr) => {
            if(curr === 'app.json') {
                acc = path + '/' + curr;
            }
            return acc;
        },'')
        changeAppJsonRouter(appPath, name, file_path)
        return;
    }
    all_path.forEach( async val => {
        const file_type = await common.getFileType(`${path}/${val}`)
        if(file_type === 'dir') {
            readRouterFile(`${path}/${val}`, name, file_path)
        }
    })
}
const getRouterPath = (path) => {
    // 获取地址，拼接路由
    let routerPath = path.split('pages\\')[1].split('\\');
    return routerPath.reduce((acc,curr) => {
        acc += `/${curr}`
        return acc;
    }, 'pages')
    
}
const changeAppJsonRouter = (appPath, name, file_path) => {
   
    let routerStr = getRouterPath(file_path)
    fs.readFile(appPath, (err, data) => {
        if(err){
            reject(err);
        }
        let JsonDta = JSON.parse(data.toString());
        // 如果路由已经存在，则不反复写入
        if(!JsonDta.pages.includes((`${routerStr}/${name}`))) {
            JsonDta.pages.push(`${routerStr}/${name}`);
        }
        fs.writeFile(appPath, JSON.stringify(JsonDta, null, '\t'), (err, data) => {
            if(err){
                console.log(err);
            }
        })
    })
}

module.exports = page