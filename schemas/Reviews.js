"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    movie:{
        type: Schema.Types.ObjectId,
        required: true
    },
    rating: {
    type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', ReviewSchema);