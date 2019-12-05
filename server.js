const express = require("express");

const usersRouter = require("./users/userRouter");
const postsRouter = require("./posts/postRouter");

const server = express();

server.use("/users", usersRouter);
server.use("/posts", postsRouter);
server.use(express.json());
server.use(logger);

server.get("/", (req, res) => {
  const message = process.env.MSG || "Hello World!";
  res.send(message);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${Date.now()}`);
  next();
}

module.exports = server;
