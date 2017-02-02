import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var gameConfigSchema = new Schema({
    cooperation: {
        type: String,
        uppercase: true,
        required: true
    },
    mode: {
        type: String,
        uppercase: true,
        required: true
    },
    earlyType: {
        type: String,
        uppercase: true,
        required: true
    },
    startNumPatientAs: {
        type: Number,
        required: true
    },
    startNumPatientBs: {
        type: Number,
        required: true
    },
    numOfDoctors: {
        type: Number,
        required: true
    },
    numOfNurses: {
        type: Number,
        required: true
    },
    numOfSurgeons: {
        type: Number,
        required: true
    },
    totalTimeInSeconds: {
        type: Number,
        required: true
    },
    NHstartNumPatientAs: {
        type: Number,
        required: true
    },
    NHstartNumPatientBs: {
        type: Number,
        required: true
    },
    NHnumOfDoctors: {
        type: Number,
        required: true
    },
    NHnumOfNurses: {
        type: Number,
        required: true
    },
    NHnumOfSurgeons: {
        type: Number,
        required: true
    },
    patientHelpTimeInSeconds: {
        type: Number,
        required: true
    }
});

export default mongoose.model('GameConfig', gameConfigSchema, 'gameConfig');
