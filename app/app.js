// app

const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");

const app = new Koa();
const router = new Router();

const hooks = require("./controllers/hooks");

app.use(logger((str, args) => {
    args.splice(2, 0, new Date());
    console.log(...args);
}));
app.use(bodyParser());


// routes
router.post("/api/post-receive", hooks.post_receive);


app.use(router.routes()).use(router.allowedMethods());

module.exports = app;


