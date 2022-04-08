"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ReviewSchema = new Schema({
    reviewer: {
        type: Object,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Review', ReviewSchema);