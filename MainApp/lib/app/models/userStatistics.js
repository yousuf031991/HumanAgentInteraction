import mongoose from "mongoose";
import validate from "mongoose-validator";
const Schema = mongoose.Schema;


let numberValidator = [
    validate({
        validator: 'isNumeric',
        message: 'Should contain numeric characters only'
    })
];

let userStatisticsSchema = new Schema({
    username: {
        type: String,
    },
    gameConfigId: {
        type: String,
    },
    finalScore: {
        type: Number,
        validate: numberValidator
    },
    versionNum: {
        type: Number,
        validate: numberValidator
    },
    moves: [{}],
    demographics: [{
            question: String,
            response: Schema.Types.Mixed
        }],
    trustAndTaskQuestionnaire: [{
            question: String,
            response: String
        }],
    timeOf: {
        type: Date,
        default: Date.now
    },
    timesGameLoaded:{
        type: Number
    }

});

export default mongoose.model('UserStatistics', userStatisticsSchema, 'userStatistics');
