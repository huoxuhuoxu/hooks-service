
/**
 *  @readme
 *      处理由git仓库发起的hooks
 * 
 */


module.exports.post_receive = async ctx => {
    console.log(ctx.request.body);
    ctx.body = "111221";
};


