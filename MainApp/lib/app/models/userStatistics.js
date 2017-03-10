import mongoose from 'mongoose';
import validate from 'mongoose-validator';
const Schema = mongoose.Schema;

var numberValidator =[
    validate({
        validator: 'isNumeric',
        message: 'Should contain numeric characters only'
        })
];

var userStatisticsSchema = new Schema({
    username: {
        type: String,
    },
    gameConfigId: {
        type: String,
    },
    finalScore: {
        type: Number,
        validate: numberValidator,
    },
    moves:[String],
    demographics:[
    {
        question: String,
        response: Schema.Types.Mixed
    }
    ],
    trustAndTaskQuestionnaire:[
    {
        question: String,
        response: String
    }
    ]
   
});

export default mongoose.model('UserStatistics', userStatisticsSchema, 'userStatistics');
