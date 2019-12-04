const express = require("express");

const router = express.Router();

const UserDb = require("./userDb");
const PostsDb = require("../posts/postDb");

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  const { name } = req.body;
  UserDb.insert({ name: name })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error saving new user." });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const { id } = req.params;
  PostsDb.insert({ user_id: id, text: req.body.text })
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Post could not be added." });
    });
});

router.get("/", (req, res) => {
  UserDb.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  UserDb.getById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ message: "User with specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "User data could not be retrieved." });
    });
});

router.get("/:id/posts", (req, res) => {
  const { id } = req.params;
  UserDb.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Posts for user could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  UserDb.getById(id).then(user => {
    if (user) {
      UserDb.remove(id)
        .then(() => {
          res.status(200).json(user);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "User could not be removed." });
        });
    } else {
      res
        .status(404)
        .json({ message: "User with specified ID does not exist" });
    }
  });
});

router.put("/:id", (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  UserDb.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "Invalid ID." });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error validating ID." });
    });
}

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "Name field required." });
    }
  } else {
    res.status(400).json({ message: "User data required." });
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Post text field required." });
    }
  } else {
    res.status(400).json({ message: "Post data required." });
  }
}

module.exports = router;
