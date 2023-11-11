const mongoose = require('mongoose');
const Book = require('../models/book');
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('remove', async function(next) {
    try {
        const book = await Book.find({author: this.id})
        if(book && book.length > 0) 
            next(new Error('Authors has books stored. Please remove books and then delete author.'))
        else if (book == null)
            next()
    }
    catch(e) {
        next(e)
    }
})

module.exports = mongoose.model('Author', authorSchema);