'use strict'

var mongoose = require('mongoose');
var builder = require('./schemaBuilder');
var schemas = require('./schemaName');

const schema = mongoose.Schema;

var TrainingPreferenceSchema = new schema({
    username: String,
    genre: String,
    like: Boolean,
    timestamp: Number
});

TrainingPreferenceSchema.statics.newFromObject = function(object) {
    return new this(object);
};

module.exports = TrainingPreferenceSchema;