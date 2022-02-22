#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const create = require('./create')
const list = [
    {
        type: 'list',
        name: 'type',
        message: 'What kind of project do you want to create?',
        choices: ['normal', 'cloud']
    },
    {
        type: 'input',
        name: 'appid',
        message: 'please input your AppID:',
    }
]

// 获取版本信息
program.version(require('../package.json').version)

program.command('init <name> [branch]')
       .description('初始化项目')
       .action((name, branch) => {
           inquirer.prompt(list).then(answer => {
               let data = {name, ...answer}
               create.init(data)
           })
       }) // 初始命令

// 定义命令
program.option(
    '-s, --source',
    'this is a source',
    (v, n) => {
      // 这里的v 就是传入的命令行参数
      // n 就是第四个参数
      console.log(v + '-source' + n);
      
      return v + '-source' + n;
    },
  );
program.option('-p, --page  <name...>', 'create a Page for your project')
        .option('-c, --component <name...>', 'create a Component for your project')
        .action((name) => {
            if(name.page) {
                create.page({name: name.page[0], dir: name.page[1]})
            }
            if(name.component){
                create.component({name: name.component[0], dir: name.component[1]})
            }
        })
program.parse(process.argv);

// program.action((name, branch) => {
//     console.log('name', name);
//     console.log('branch', branch);
// })
// function page(...args) {
//     console.log('args', args);
//     return;
// }



