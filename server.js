const express = require("express");

const usersRouter = require("./users/userRouter");

const server = express();

server.use("/users", usersRouter);
server.use(express.json());
server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${Date.now()}`);
  next();
}

module.exports = server;
