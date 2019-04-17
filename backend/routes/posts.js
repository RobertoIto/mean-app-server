const express = require('express');
const multer = require('multer');

const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(null, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get("", (req, res, next) => {
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

router.post(
    "", 
    multer({storage: storage}).single('image'), 
    (req, res, next) => {
        const url = req.protocol + '://' + req.get('host');
        const post = new Post({        
            title: req.body.title,
            content: req.body.content,
            imagePath: url + '/images/' + req.file.filename
        });
        console.log(post);
        post.save().then(createdPost => {
            //console.log(result);
            res.status(201).json({
                message: 'Post added successfully',
                post: {
                    // id: createdPost._id,
                    // title: createdPost.title,
                    // content: createdPost.content,
                    // imagePath: createdPost.imagePath
                    // or
                    ...createdPost,
                    id: createdPost._id
                }
            });
        })
    }
);

router.put(
    "/:id", 
    multer({storage: storage}).single('image'), 
    (req, res, next) => {
        let vImagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get('host');
            vImagePath = url + '/images/' + req.file.filename;
        }
        const post = new Post({
            _id: req.body.id,
            title: req.body.title,
            content: req.body.content,
            imagePath: vImagePath
        });
        Post.updateOne({_id: req.params.id}, post).then(result => {
            console.log(result);
            res.status(200).json({message: 'Update successful!'});
        });
    }
);

router.delete("/:id", (req, res, next) => {
    //console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ message: "Post deleted!" });
    });
});

module.exports = router;