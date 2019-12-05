const express = require("express");

const router = express.Router();

const UserDb = require("../users/userDb");
const PostsDb = require("./postDb");

router.use(express.json());

router.get("/", (req, res) => {
  PostsDb.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Posts could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
