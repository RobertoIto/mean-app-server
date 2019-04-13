const express = require('express');

const app = express();

// This middleware grants access to all external requests.
// Avoid CORS error.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Header', 
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

app.use('/api/posts', (req, res, next) => {
    const posts = [
        { id: '1', title: 'First server-side post', content: 'This is coming from the server 1.' },
        { id: '2', title: 'Second server-side post', content: 'This is coming from the server 2.' }
    ];
    return res.status(200).json({
        message: 'Post fetched successfully!',
        posts: posts
    });
});

module.exports = app;