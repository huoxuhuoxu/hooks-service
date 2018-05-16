// app

const path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
// const static = require("koa-static");

const app = new Koa();
const router = new Router();

const hooks = require("./controllers/hooks");


app.use(logger((str, args) => {
    args.splice(2, 0, new Date());
    console.log(...args);
}));
app.use(bodyParser());


// web page
// app.use(static(path.join(__dirname, "../public")));

// middleware
app.use(async (ctx, next) => {
    ctx.response.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    });
    next();
});


// routes
router.post("/api/post-receive", hooks.post_receive);
router.put("/testing", async (ctx) => {
    ctx.body = "111";
});


app.use(router.routes()).use(router.allowedMethods());

module.exports = app;



