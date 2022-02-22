const fs = require('fs');
const ora = require('ora')
const execa = require('execa');
const copyDir = require('./copy')
const chalk = require('chalk');
const path = require('path')
// 获取当前执行cli的文件目录
let dir_path = `${process.cwd()}`
// spinner
const spinner = ora(`loading...\n`)
const init = async (data) => {
    const {type, appid, name} = data;
    console.log('__filename', path.join(__dirname, `../templates/${type}`, 'project.config.json'));
    // 获取文件路径
    let project_name =`${dir_path}/${name}`;
    console.log('project_name', project_name);
    try {
        // 创建文件
        await execa('mkdir', [project_name])
        // 复制文件
        copyTemplate(type, project_name);
        spinner.start();
        // 获取项目工程配置文件
        let wechatConfig = await readConfigJsonFile(type);
        wechatConfig.appid = appid;
        wechatConfig.projectname = name;

        // 转换数据为json string格式
        let wechatJson = JSON.stringify(wechatConfig, null, '\t');
        // 写入文件
        await writeConfigJsonFile(project_name, wechatJson)
        spinner.stop();
        console.log(chalk.green(`
        ******************************************
        * your "${name}" project init success
        *
        * you can use wechart tools open your "${name}"
        * 
        * ok  ✔️✔️✔️😃😃😃
        *
        ******************************************
          `))

    }catch(e) {
        spinner.fail(chalk.red(e))
    }
    
    
}
/**
 * 
 * @param {读取模板类型} type 
 * @returns 
 */
const readConfigJsonFile = async (type) => {
  return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, `../templates/${type}`, 'project.config.json'), (err, data) => {
            if(err){
                reject(err);
            }
            resolve(JSON.parse(data.toString()));
        })
    })
}
/**
 * 
 * @param {目标文件地址} path 
 * @param {写入文件的json对象} str 
 */
const writeConfigJsonFile = async (path, str) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${path}/project.config.json`, str, (err,data) => {
            if(err) {
                reject(err)
            }
            resolve()
        })
    })
}

// 复制文件
const copyTemplate =  (type, dest_path) => {
    let orgin =  path.join(__dirname, '../templates', type);
    copyDir(orgin, dest_path)
}




module.exports = init;