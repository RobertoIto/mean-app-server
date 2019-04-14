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

// app.use((req, res, next) => {
//     console.log('First middleware');
//     next();
// });

app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: '1', title: 'First server-side post', content: 'This is coming from the server 1.' },
        { id: '2', title: 'Second server-side post', content: 'This is coming from the server 2.' }
    ];
    return res.status(200).json({
        message: 'Post fetched successfully!',
        posts: posts
    });
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    post.save();
    res.status(201).json({
        message: 'Post added successfully'
    })
});

module.exports = app;