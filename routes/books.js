const express = require('express')
const booksRouter = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join(`public`, Book.coverImgPath);
const imgMimeTypes = ['image/jpeg', 'image/jpg', 'image/png','image/gif']
const multer = require('multer');
const upload = multer({
    dest:  uploadPath,
    fileFilter: (req, file, cb) => {
        cb(null, imgMimeTypes.includes(file.mimetype))
    }
})

booksRouter.get('/', async (req, res) => {
    try {
        let query = Book.find();
        if(req.query.title)
            query.regex('title', new RegExp(req.query.title, 'i'))
        if(req.query.publishedBefore)
            query.lte('publishDate', req.query.publishedBefore)
        if(req.query.publishedAfter)
            query.gte('publishDate', req.query.publishedAfter)
        const books = await query.exec();
        res.render('books/index', {books, searchParams: req.query})
    }
    catch {
        res.redirect('/')
    }
})

booksRouter.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

booksRouter.post('/', upload.single('cover'), async (req, res) => {
    const data = req.body || {};
    const fileName = (req.file && req.file.filename) ? req.file.filename : null;
    const book = new Book({
        title: data.title,
        author: data.author,
        publishDate: new Date(data.publishDate),
        pageCount: data.pageCount,
        coverImageName: fileName,
        description: data.description
    })
    try {
        await book.save();
        res.redirect('books');
    } catch(e) {
        if(book.coverImageName)
            removeBookCover(book.coverImageName)
        renderNewPage(res, book, true)
    }
})

let renderNewPage = async(res, book, hasError=false) => {
    try {
        const authors = await Author.find({});
        let params = {authors, book};
        if(hasError) 
            params.errorMessage = "Error creating new book";
        
        res.render('books/new', params);
    } catch(e) {
        res.redirect('/books')
    }
};

let removeBookCover = (fileName) => {
    fs.unlink(path.join(uploadPath, fileName), (error) => 
    {
        if(error)
            console.log("Error while removing book cover:", error)
    })
}

module.exports = booksRouter;