const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const author = require('../models/author');

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
    //res.send(req.body.authorName)
    try {
        const author = new Author({
            name: req.body.authorName
        });
        await author.save();
        res.redirect("authors")
    } catch(e) {
        res.render("authors/new", {
            errorMessage: e,
            authorName: req.body.authorName
        })
    }
})

module.exports = router;