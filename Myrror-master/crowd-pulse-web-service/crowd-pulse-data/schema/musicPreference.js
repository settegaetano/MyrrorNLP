'use strict'

var mongoose = require('mongoose');
var builder = require('./schemaBuilder');
var schemas = require('./schemaName');

const schema = mongoose.Schema;

var MusicPreferenceSchema = new schema({
    username: String,
    song: String,
    artist: String,
    genre: String,
    like: Boolean,
    timestamp: Number
});

MusicPreferenceSchema.statics.newFromObject = function(object) {
    return new this(object);
};

module.exports = MusicPreferenceSchema;