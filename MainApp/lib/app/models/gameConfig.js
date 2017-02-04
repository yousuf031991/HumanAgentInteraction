import mongoose from 'mongoose';
import validate from 'mongoose-validator';
const Schema = mongoose.Schema;

var numberValidator =[
    validate({
        validator: 'isNumeric',
        message: 'Should contain numeric characters only'
        })
];

var gameConfigSchema = new Schema({
    cooperation: {
        type: String,
        uppercase: true,
        enum: ['HIGH COOPERATION', 'LOW COOPERATION']
    },
    mode: {
        type: String,
        uppercase: true,
        enum: ['NORMAL MODE', 'PRACTICE MODE']
    },
    earlyType: {
        type: String,
        uppercase: true,
        enum: ['EARLY FAST', 'EARLY SLOW']
    },
    startNumPatientAs: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    startNumPatientBs: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    numOfDoctors: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    numOfNurses: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    numOfSurgeons: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    totalTimeInSeconds: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    NHstartNumPatientAs: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    NHstartNumPatientBs: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    NHnumOfDoctors: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    NHnumOfNurses: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    NHnumOfSurgeons: {
        type: Number,
        validate: numberValidator,
        required: true
    },
    patientHelpTimeInSeconds: {
        type: Number,
        validate: numberValidator,
        required: true
    }
});

export default mongoose.model('GameConfig', gameConfigSchema, 'gameConfig');
