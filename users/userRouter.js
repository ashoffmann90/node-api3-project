const express = require('express');
const Users = require('./userDb.js')
const Posts = require('../posts/postDb.js')
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    console.log(err)
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id
  const body = req.body
  Posts.insert({...body, user_id: id})
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: 'Could not post'})
  })
});

router.get('/', (req, res) => {
  Users.get(req)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({error: 'The user info could not be retrieved'})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id
  Users.getById(id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({error: 'The user could not be retrieved'})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id
  Users.getUserPosts(id)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    res.status(500).json({ error: 'Posts could not be retrieved'})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id
  Users.remove(id)
  .then(user => {
    res.status(201).json({ message: 'User has been removed'})
  })
  .catch(err => {
    res.status(500).json({ error: 'Error removing user'})
  })
});

router.put('/:id', (req, res) => {
  const id = req.params.id
  const updatedUser = req.body
  Users.update(id, updatedUser)
  .then(upUser => {
    if(upUser){
      Posts.findById(id)
      .then(([user]) => {
        res.status(201).json(user, {message: 'User updated'})
      })
    } else {
      res.status(404).json({ error: 'User could not be found'})
    }
  })
  .catch(err => {
    res.status(500).json({ error: 'User could not be updated'})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id
    Users.getById(id)
    .then(user => {
      if(user) {
        req.user = user
        next()
      } else {
        res.status(400).json({ message: 'Invalid user id'})
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({error: 'Error validating user id'})
    })
}

function validateUser(req, res, next) {

  if(!req.body){
    res.status(400).json({ message: "Missing user data" })
  } else if ( !req.body.name){
    res.status(400).json({ message: "Missing required name field" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const body = req.body
  if(!body){
    res.status(400).json({ message: "missing post data" })
  } else if(!body.text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next()
  }
}

module.exports = router;
