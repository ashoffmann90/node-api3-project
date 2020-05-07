const express = require('express');
const Posts = require('./postDb')
const router = express.Router();

router.get('/', (req, res) => {
  Posts.get(req.body)
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    res.status(500).json({ error:'Could not get posts'})
  })
});

router.get('/:id', validatePostId, (req, res) => {
  const id = req.params.id
  Posts.getById(id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({ error:'Could not get post'})
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  const id = req.params.id
  Posts.remove(id)
  .then(post => {
    res.status(202).json({ message:'Post removed'})
  })
  .catch(err => {
    res.status(500).json({ error: 'Post could not be removed'})
  })
});

router.put('/:id', validatePostId, (req, res) => {
  const id = req.params.id
  const upPost = req.body
  Posts.update(id, upPost)
  .then(post =>{
    res.status(201).json({ message:'Post updated'})
  })
  .catch(err => {
    res.status(500).json({ message:'Could not update post'})
  })
});

// custom middleware

function validatePostId(req, res, next) {
  const id = req.params.id
    Posts.getById(id)
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

module.exports = router;
