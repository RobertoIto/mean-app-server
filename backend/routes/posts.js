const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.get("", (req, res, next) => {
    // const posts = [
        // { id: '1', title: 'First server-side post', content: 'This is coming from the server 1.' },
        // { id: '2', title: 'Second server-side post', content: 'This is coming from the server 2.' }
    // ];

    Post.find()
        .then(documents => {
            //console.log(documents);
            res.status(200).json({
                message: 'Post fetched successfully!',
                posts: documents
            });
        });
});


// We are going to use this function to get one record from the
// database, when the page is reloaded, the previous get method
// is only the post-list.component and not in post-create.component.
router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({
                    message: 'Post not found!'
                });
            }
        });
});

router.post("", (req, res, next) => {
    const post = new Post({        
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    post.save().then(createdPost => {
        //console.log(result);
        res.status(201).json({
            message: 'Post added successfully',
            postId: createdPost._id
        });
    })
});

router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: 'Update successful!'});
    })
});

router.delete("/:id", (req, res, next) => {
    //console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ message: "Post deleted!" });
    });
});

module.exports = router;