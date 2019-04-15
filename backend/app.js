const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb://localhost:27017/mean-db?retryWrites=true")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// This middleware grants access to all external requests.
// Avoid CORS error.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.get('/api/posts', (req, res, next) => {
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

app.post("/api/posts", (req, res, next) => {
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

app.delete("/api/posts/:id", (req, res, next) => {
    //console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ message: "Post deleted!" });
    });
});

module.exports = app;