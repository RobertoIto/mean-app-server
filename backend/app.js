const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

// Local connection
// mongoose.connect("mongodb://localhost:27017/mean-db?retryWrites=true")
// Cloud connection mongoDB Atlas without bcrypt
//mongoose.connect("mongodb+srv://rito:ZzPZCTkFuolGKVKF@cluster0-g8o4u.mongodb.net/test?retryWrites=true")
// Cloud connection mongoDB Atlas with bcrypt
mongoose.connect("mongodb+srv://rito:ZzPZCTkFuolGKVKF@cluster0-g8o4u.mongodb.net/test")
    .then(() => {
        console.log('Connected to database!');
    })
    .catch(() => {
        console.log('Connection failed!');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

// This middleware grants access to all external requests.
// Avoid CORS error.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods', 
        'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

module.exports = app;