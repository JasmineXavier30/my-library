const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book')

//All authors
router.get("/", async (req, res) => {
    try {
        let filter = {};
        if(req.query.name)
            filter.name = new RegExp(req.query.name, 'i')

        const authors = await Author.find(filter)
        res.render("authors/index", {authors, name: req.query.name})
    } catch(e) {
        res.redirect("/", {errorMessage: e})
    }
})

//New Author
router.get("/new", (req, res) => {
    res.render("authors/new", {author: new Author()});
})

//Create Author
router.post("/", async (req, res) => {
    let author;
    try {
        author = new Author({
            name: req.body.name
        });
        await author.save();
        res.redirect("authors")
    } catch(e) {
        res.render("authors/new", {
            errorMessage: e,
            author
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id});
        res.render('authors/show', {author, books})
    }
    catch(e) {
        res.redirect('/')
    }
    
})

router.get("/:id/edit", async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        res.render(`authors/edit`, {author})
    }
    catch(e) {
        if(!author)
            res.redirect('/authors')
    }
})

router.put("/:id", async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`)
    }
    catch(e) {
        if(!author)
            res.redirect('/')
        else
            res.render(`authors/edit`, {author, errorMessage: e})
    }
})

router.delete("/:id", async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors')
    }
    catch(e) {
        if(!author)
            res.redirect('/')
        else
            res.redirect(`/authors/${req.params.id}`)
    }
})
module.exports = router;