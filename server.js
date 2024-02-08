const express = require('express');
const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const STORE_FILE = 'store.json';

app.use(express.json());

let store = {};
if (fs.existsSync(STORE_FILE)) {
    store = jsonfile.readFileSync(STORE_FILE);
}

app.use((req, res, next) => {
    next();
    jsonfile.writeFileSync(STORE_FILE, store, { spaces: 2 }) ;
});

app.use((err, req, res, next) => {
    console.error (err.stack);
    res.status(500).send('Something broke!');
});

// GET /posts
app.get('/posts', (req, res) => {
    res.json(store.posts || []);
});

//**********************SAMPLE API calls*******************/
// GET /posts/{id}
app.get('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = (store.posts || []).find(post => post.id === postId);
    if (!post) {
        res.status(404).send('Post not found by this ID');
    } else {
        res.json(post);
    }
}
);

// POST /posts
app.post('/posts', (req, res) => {
    const newPost = req.body;
    if (!newPost.id || store.posts.find(post => post.id === newPost.id)) {
        res.status(400).send('Invalid or duplicate post ID');
    } else {
        store.posts = store.posts || [];
        store.posts.push(newPost);
        res.status(201).json(newPost);
    }
});

// DELETE /posts/{id}
app.delete('/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = (store.posts || []).findIndex(post => post.id === postId);
    if (index === -1) {
        res.status(404).send('Post not found');
    } else {
        store.posts.splice(index, 1);
        res.status(204).send();
    }
});

//*****************Added API calls******************/
// GET /authors
app.get('/authors', (req, res) => {
    res.json(store.authors || []);
});

// GET /authors/{id}
app.get('/authors/:id', (req, res) => {
    const authorId = parseInt(req.params.id);
    const author = (store.authors || []).find(author => author.id === authorId);
    if (!author) {
        res.status(404).send('Author not found');
    } else {
        res.json(author);
    }
}
);

//POST /authors
app.post('/authors', (req, res) => {
    const newAuthor = req.body;
    if (!newAuthor.id || store.authors.find(author => author.id === newAuthor.id)) {
        res.status(400).send('Invalid or duplicate author ID');
    } else {
        store.authors = store.authors || [];
        store.authors.push(newAuthor);
        res.status(201).json(newAuthor);
    }
}
);

// DELETE /authors/{id}
app.delete('/authors/:id', (req, res) => {
    const authorId = parseInt(req.params.id);
    const index = (store.authors || []).findIndex(author => author.id === authorId);
    if (index === -1) {
        res.status(404).send('Author not found by provided ID');
    } else {
        store.authors.splice(index, 1);
        res.status(204).send();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
