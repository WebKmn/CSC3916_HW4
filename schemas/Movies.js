"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Actors = require('./Actors').schema;

let val = function(actors) {
    return !(actors.length === 0 || actors.length < 3);
}

let MovieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    actors:{
        type: [Actors],
        required: true,
        validate: [val, 'Please add three or more actors to list.']
    }
});

MovieSchema.methods.validateProperties = function() {
    const movie = this;
    return !(movie.releaseDate === null || movie.genre === '' || movie.actors.length < 3);
};

module.exports = mongoose.model('Movie', MovieSchema);