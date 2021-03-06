
/**
 *  @readme
 *      post_receive:
 *          处理由git仓库发起的hooks
 * 
 *      is_running: 
 *          检测当前进程作为监控服务进程是否处于运行状态
 * 
 * 
 *      存在一个问题：
 *          不存在项目，自动向git-service发起仓库拉起，第一次需要手动同意, 获取与远程主机的通信密钥...(应该可以手动写入known_hosts ... )
 * 
 */

const fs = require("fs");
const path = require("path");
const { succ } = require("../resultJson");
const yaml = require("js-yaml");
const { execSync, createError } = require("../libs/tools");
const { info, error } = require("../libs/colors");


const mode_running = {
    pm2: (service_name, entrypoint) => {
        try {
            execSync(`pm2 list | grep '${service_name}'`);
            execSync(`pm2 restart ${service_name}`);
        } catch (err){
            execSync(`pm2 start ${entrypoint} --name ${service_name}`);
        }
    }
};

// 启动/重启 服务
const startup_project = (service_name) => {

    const deploy_path = "deploy.yaml";

    try {
        fs.accessSync(deploy_path);
    } catch (err){
        const msg = `[warning] 不存在部署文件: ${deploy_path}, 放弃自动化部署`;
        error(msg);
        throw createError(msg);
    }

    try{
        const deploy = yaml.safeLoad(fs.readFileSync(deploy_path));

        if (deploy.run){
            for (let cmd of deploy.run){
                execSync(cmd);
            }
        }

        if ("service" in deploy && deploy["service"]["mode"] in mode_running) {

            const { mode, entrypoint } = deploy["service"];

            if (!entrypoint){
                const msg = `[warning] mode: ${mode} 缺少参数`;
                error(msg);
                throw createError(msg);
            }

            return mode_running[mode](service_name, entrypoint);
            
        }

        if (deploy["service"] && deploy["service"]["mode"]){
            const msg = `[warning] 不存在 ${deploy["service"]["mode"]} 部署方式，放弃自动化部署`;
            error(msg);
            throw createError(msg);
        }

        info("[info] 没有配置有效启动服务的方式，不启动服务");

    } catch (err){
        throw createError(err.message || err.toString());
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

    info("[info] 切换至项目存放目录 %s", dir_path);
    process.chdir(dir_path);

    const { ip, username, git_dir_path } = git_servicer;

    info("[info] 开始拉取项目: %s", warehourse);
    execSync(`git clone ${username}@${ip}:${git_dir_path}/${warehourse}.git`);

    const project_path = path.resolve(dir_path, warehourse); 
    info("[info] 切换至项目目录 %s", project_path);
    process.chdir(project_path);

    startup_project(warehourse);

};



module.exports.post_receive = async ctx => {

    const { dir_path, git_servicer } = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, "../../config.yaml")));
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


module.exports.is_running = async ctx => {
    ctx.body = succ;
};



