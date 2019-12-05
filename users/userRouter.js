const express = require("express");

const router = express.Router();

const UserDb = require("./userDb");
const PostsDb = require("../posts/postDb");

router.use(express.json());

router.post("/", validateUser, (req, res) => {
  const name = req.body;
  UserDb.insert(name)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error saving new user." });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const newPost = { user_id: req.user.id, text: req.body.text };
  PostsDb.insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error inserting new post." });
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

router.get("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  UserDb.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "User data could not be retrieved." });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.user.id;
  UserDb.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Error getting posts." });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const id = req.user.id;
  UserDb.getById(id)
    .then(user => {
      UserDb.remove(id)
        .then(() => {
          res.status(200).json(user);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Remove user failed." });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Remove user failed." });
    });
});

router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.user.id;
  UserDb.update(id, { name: req.body.name })
    .then(() => {
      UserDb.getById(id)
        .then(user => {
          res.status(200).json(user);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: "Could not update user." });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Update user failed." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  if (id) {
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
  } else {
    res.status(400).json({ message: "User ID required." });
  }
}

function validateUser(req, res, next) {
  !req.body && res.status(400).json({ message: "User data required." });
  !req.body.name && res.status(400).json({ message: "User name required." });
  next();
}

function validatePost(req, res, next) {
  !req.body && res.status(400).json({ message: "Post data required." });
  !req.body.text && res.status(400).json({ message: "Post text required." });
  next();
}

module.exports = router;
