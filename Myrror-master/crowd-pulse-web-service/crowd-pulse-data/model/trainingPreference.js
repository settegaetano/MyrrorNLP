'use strict';

var TrainingPreferenceSchema = require('./../schema/trainingPreference');

module.exports = function(mongoose) {
    return mongoose.model('TrainingPreference', TrainingPreferenceSchema);
};