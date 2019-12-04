const express = require("express");

const router = express.Router();

const UserDb = require("./userDb");

router.use(express.json());

router.post("/", (req, res) => {
  // do your magic!
});

router.post("/:id/posts", (req, res) => {
  // do your magic!
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
  //   const userId = req.body.user_id
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
