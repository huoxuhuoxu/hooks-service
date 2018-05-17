
/**
 *  @readme
 *      处理由git仓库发起的hooks
 * 
 */

const fs = require("fs");
const path = require("path");
const { succ } = require("../resultJson");
const yaml = require("js-yaml");
const { execSync } = require("../lib/tools");
const { info, error } = require("../lib/colors");

// 启动/重启 服务
const startup_project = (service_name) => {

    const deploy_path = fs.readFileSync("deploy.yaml");

    try {
        fs.accessSync(deploy_path);
    } catch (err){
        return error("[warning] 不存在deploy.yaml部署文件，放弃自动化部署 ...");
    }

    try{
        const deploy = yaml.safeLoad(deploy_path);
        for (let cmd of deploy.run){
            execSync(cmd);
        }

        if ("service" in deploy && deploy["service"]["mode"] === "pm2") {
            if (execSync(`pm2 list | grep '${service_name}'`)){
                execSync(`pm2 restart ${service_name}`)
            } else {
                execSync(`pm2 start index.js --name ${service_name}`)
            }
            return ;
        }

        info("[info] 没有配置有效启动服务的方式，不启动服务");

    } catch (err){
        const error = new Error(err);
        error.status = 200;
        throw error;
    }

};


// 更新项目代码
const git_pull = (dir_path, warehourse) => {

    const project_path = path.resolve(dir_path, warehourse);
    info("[info] 切换项目路径 %s", project_path);
    process.chdir(project_path);

    execSync("git pull");

    startup_project(warehourse);
};

// 创建项目
const git_clone = (dir_path, warehourse, git_servicer) => {

    info("[info] 切换项目路径 %s", dir_path);
    process.chdir(dir_path);

    const { ip, username, git_dir_path } = git_servicer;

    info("[info] 开始拉取项目: %s", warehourse);
    execSync(`git clone ${username}@${ip}:${git_dir_path}/${warehourse}.git`);

    startup_project(warehourse);

};



module.exports.post_receive = async ctx => {

    const { dir_path, git_servicer } = yaml.safeLoad(fs.readFileSync("config.yaml"));
    const { warehourse } = ctx.request.body;

    const dirlist = fs.readdirSync(dir_path);

    if (dirlist.includes(warehourse)){

        info("[info] 更新项目: %s", warehourse);
        git_pull(dir_path, warehourse);

    } else {

        info("[info] 创建项目: %s", warehourse);
        git_clone(dir_path, warehourse, git_servicer);

    }

    ctx.body = succ;

};


