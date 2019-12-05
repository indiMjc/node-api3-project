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

router.get("/:id", validatePostId, (req, res) => {});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  PostsDb.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: "Invalid post ID." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not validate post ID." });
    });
}

module.exports = router;
