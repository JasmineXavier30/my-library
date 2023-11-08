const mongoose = require('mongoose');
const coverImgPath = 'uploads/bookCovers';
const path = require('path');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    pageCount: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    coverImageName: {
        type: String,
        required: true
    }
});

bookSchema.virtual('imgPath').get(function() {
    if(this.coverImageName != null) {
        return path.join('/', coverImgPath, this.coverImageName)
    }
});

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImgPath = coverImgPath;