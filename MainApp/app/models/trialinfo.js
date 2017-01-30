var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trialInfoSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    trialid: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('TrialInfo', trialInfoSchema, 'trialinfo');
