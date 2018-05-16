
/**
 *  @readme
 *      处理由git仓库发起的hooks
 * 
 */

const fs = require("fs");
const { succ } = require("../resultJson");
const yaml = require("js-yaml");
const execSync = require("child_process").execSync;


module.exports.post_receive = async ctx => {

    const { dir_path } = yaml.safeLoad(fs.readFileSync("config.yaml"));
    const { warehourse } = ctx.request.body;

    const dirlist = fs.readdirSync(dir_path);
    if (dirlist.includes(warehourse)){

        console.log("存在");
        process.chdir(dir_path);
        console.log(execSync("git pull"));


    } else {

        console.log("不存在需要拉取...");

    }


    ctx.body = succ;

};


