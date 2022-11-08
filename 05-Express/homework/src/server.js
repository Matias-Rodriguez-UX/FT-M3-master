// const bodyParser = require("body-parser");
const e = require("express");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
// server.use(express.json());
server.use(express.json())
let id = 1
// TODO: your code to handle requests
server.post('/posts', (req, res) => {
    const { author, title, contents } = req.body;
    if (author && title && contents) {
        let Post = {
            author,
            title,
            contents,
            id: id++
        }
        posts.push(Post)
        res.status(200).json(Post)
    } else {
        return res
            .status(STATUS_USER_ERROR)
            .json({ error: "No se recibieron los parámetros necesarios para crear el Post" })
    }
    res.send("Datos cargados")
})

server.post('/posts/author/:author', (req, res) => {
    const author = req.params.author
    const { title, contents } = req.body
    if (author && title && contents) {
        let Post = {
            author,
            title,
            contents,
            id: id++
        }
        posts.push(Post)
        res.status(200).json(Post)
    } else {
        return res
            .status(STATUS_USER_ERROR)
            .json({ error: "No se recibieron los parámetros necesarios para crear el Post" })
    }
})

server.get('/posts', (req, res) => {
    const { term } = req.query
    if (term) {
        const filtPosts = posts.filter(el => el.title.includes(term) || el.contents.includes(term))
        filtPosts ? res.json(filtPosts) : res.json(posts)
    } else {
        res.json(posts)
    }
})

server.get('/posts/:author', (req, res) => {
    const { author } = req.params
    const author_post = posts.filter(el => el.author === author)
    if (author_post.length) {
        res.json(author_post)
    } else {
        res
            .status(STATUS_USER_ERROR)
            .json({ error: "No existe ningun post del autor indicado" })
    }
})

server.get('/posts/:author/:title', (req, res) => {
    const { author, title } = req.params
    const a_t_posts = posts.filter(el => (el.title === title && el.author === author))
    if (a_t_posts.length) {
        res.json(a_t_posts)
    } else {
        res
            .status(STATUS_USER_ERROR)
            .json({ error: "No existe ningun post con dicho titulo y autor indicado" })
    }
})

server.put('/posts', (req, res) => {
    const { id, title, contents } = req.body
    if (!id || !title || !contents) {
        res
            .status(STATUS_USER_ERROR)
            .json({ error: "No se recibieron los parámetros necesarios para modificar el Post" })
    } else {
        let post_found = posts.find(post => post.id == id)
        if (post_found) {
            post_found.title = title
            post_found.contents = contents
            res.json(post_found)
        } else {
            res
                .status(STATUS_USER_ERROR)
                .json({ error: "No se recibieron los parámetros necesarios para modificar el Post" })
        }

    }

})

server.delete('/posts', (req, res) => {
    const { id } = req.body
    let index = posts.findIndex(p => p.id == id)
    if (!id || index < 0) {
        return res
            .status(STATUS_USER_ERROR)
            .json({ error: "Mensaje de error" })
    } else {
        posts.splice(index, 1)
        res.json({ success: true })
    }

})

server.delete('/author', (req, res) => {
    const { author } = req.body
    let author_found = posts.find(p => p.author === author)
    if (!author || !author_found) {
        return res
            .status(STATUS_USER_ERROR)
            .json({ error: "No existe el autor indicado" })
    }
    let delete_post = [];
    delete_post = posts.filter(post => post.author === author)
    posts = posts.filter(post => post.author !== author)
    res.json(delete_post)

})

module.exports = { posts, server };
