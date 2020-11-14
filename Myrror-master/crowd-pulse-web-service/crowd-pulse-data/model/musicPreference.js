'use strict';

var MusicPreferenceSchema = require('./../schema/musicPreference');

module.exports = function(mongoose) {
    return mongoose.model('MusicPreference', MusicPreferenceSchema);
};