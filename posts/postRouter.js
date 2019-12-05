const express = require("express");

const router = express.Router();

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

router.delete("/:id", validatePostId, (req, res) => {
  const { id } = req.post;
  PostsDb.remove(id)
    .then(() => {
      res.status(200).json({ message: "Post deleted." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Could not delete post." });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const { id } = req.post;
  PostsDb.update(id, { text: req.body.text })
    .then(() => {
      res.status(200).json({ message: "Post edited." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Post edit failed." });
    });
});

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
