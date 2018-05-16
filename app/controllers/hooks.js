
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

    const { dir_path, git_servicer } = yaml.safeLoad(fs.readFileSync("config.yaml"));
    const { warehourse } = ctx.request.body;

    const dirlist = fs.readdirSync(dir_path);

    const project_path = path.resolve(dir_path, warehourse);
    console.log("[info] 切换项目路径 %s", project_path);
    process.chdir(project_path);

    if (dirlist.includes(warehourse)){

        console.log(execSync("git pull").toString());

        const deploy = yaml.safeLoad(fs.readFileSync("deploy.yaml"));
        for (let cmd of deploy.run){
            console.log(execSync(cmd).toString());
        }

        const service_name = deploy.service[0]["name"];
        
        if (execSync(`pm2 list | grep '${service_name}'`).toString()){
            console.log(execSync(`pm2 restart ${service_name}`));
        } else {
            console.log(execSync(`pm2 start index.js --name ${service_name}`));
        }

    } else {

        const { ip, username, git_dir_path } = git_servicer;

        console.log("[info] 开始拉取项目: %s", warehourse);
        console.log(execSync(`git clone ${username}@${ip}:${git_dir_path}/${warehourse}.git`));

    }

    ctx.body = succ;

};


