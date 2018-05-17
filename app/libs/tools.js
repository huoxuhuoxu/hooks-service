
const execSync = require("child_process").execSync;

module.exports.execSync = (...args) => {
    console.log("[info] 需要执行的命令: \r\n%s", args.join(" , "));
    const resul = execSync(...args).toString();
    console.log("[info] 执行结果: \r\n%s", resul);
    return resul;
};

module.exports.createError = (msg = "", status = 200) => {
    const error = new Error(msg);
    error.status = status;  
    return error;
};

