
/**
 *  @readme
 *      处理由git仓库发起的hooks
 * 
 */

const fs = require("fs");
const path = require("path");
const { succ } = require("../resultJson");
const yaml = require("js-yaml");
const execSync = require("child_process").execSync;


module.exports.post_receive = async ctx => {

    const { dir_path } = yaml.safeLoad(fs.readFileSync("config.yaml"));
    const { warehourse } = ctx.request.body;

    const dirlist = fs.readdirSync(dir_path);
    if (dirlist.includes(warehourse)){

        const project_path = path.resolve(dir_path, warehourse);

        console.log("[info] 切换项目路径 %s", project_path);
        process.chdir(project_path);

        console.log(execSync("git pull").toString());

        const deploy = yaml.safeLoad(fs.readFileSync("deploy.yaml"));
        for (let cmd of deploy.run){
            console.log(execSync(cmd).toString());
        }

        const service_name = deploy.service[0]["name"];
        if (execSync(`pm2 list | grep '${service_name}'`)){
            console.log(execSync(`pm2 restart ${service_name}`));
        } else {
            console.log(execSync(`pm2 start index.js --name ${service_name}`));
        }


    } else {

        console.log("不存在需要拉取...");

    }


    ctx.body = succ;

};



