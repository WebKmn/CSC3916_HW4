"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let ActorSchema = new Schema({
    actorName: {
        type: String,
        required: true
    },
    characterName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Actor', ActorSchema);