
/**
 *  @readme
 *      处理由git仓库发起的hooks
 * 
 */

const { succ } = require("../resultJson");


module.exports.post_receive = async ctx => {
    console.log(ctx.request.body);
    ctx.body = succ;
};




