const express = require("express");

const app = express();

const port = process.env.PORT || 3000;

require("./db/Register");

//
app.use(express.json());
const registerRouter = require("./routers/register");
app.use(registerRouter);

///////////////////////////////////////////////////////
app.listen(port, () => {
  console.log("All Done Successfully");
});
