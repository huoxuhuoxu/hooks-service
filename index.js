
require("dotenv").config();
const app = require("./app/app");
const PORT = process.env.PORT;



app.listen(PORT);

console.log("[info] listen port: %s", PORT);

