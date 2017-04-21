import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var gameConfigSchema = new Schema({
    cooperation: {
        type: String,
        uppercase: true,
        required: 'Cooperation field is empty!',
        enum: ['HIGH COOPERATION', 'LOW COOPERATION']
    },
    earlyType: {
        type: String,
        uppercase: true,
        required: 'Early Type field is empty!',
        enum: ['EARLY FAST', 'EARLY SLOW']
    },
    startNumPatientAs: {
        type: Number,
        min: [0, 'Start number of A patients should be greater than or equal to 0!'],
        required: 'Start number of A patients is empty!'
    },
    startNumPatientBs: {
        type: Number,
        min: [0, 'Start number of B patients should be greater than or equal to 0!'],
        required: 'Start number of B patients is empty!'
    },
    numOfDoctors: {
        type: Number,
        min: [0, 'Start number of doctors should be greater than or equal to 0!'],
        required: 'Start number of Doctors is empty!'
    },
    numOfNurses: {
        type: Number,
        min: [0, 'Start number of nurses should be greater than or equal to 0!'],
        required: 'Start number of Nurses is empty!'
    },
    numOfSurgeons: {
        type: Number,
        min: [0, 'Start number of surgeons should be greater than or equal to 0!'],
        required: 'Start number of Surgeons is empty!'
    },
    totalTimeInSeconds: {
        type: Number,
        min: [1, 'Total time in seconds should be greater than 0!'],
        required: 'Total time in seconds is empty!'
    },
    NHstartNumPatientAs: {
        type: Number,
        min: [0, 'NH Start number of A Patients should be greater than or equal to 0!'],
        required: 'NH Start number of A Patients is empty!'
    },
    NHstartNumPatientBs: {
        type: Number,
        min: [0, 'NH Start number of B Patients should be greater than or equal to 0!'],
        required: 'NH Start number of B Patients is empty!'
    },
    NHnumOfDoctors: {
        type: Number,
        min: [0, 'NH Start number of Doctors should be greater than or equal to 0!'],
        required: 'NH Start number of Doctors is empty!'
    },
    NHnumOfNurses: {
        type: Number,
        min: [0, 'NH Start number of Nurses should be greater than or equal to 0!'],
        required: 'NH Start number of Doctors is empty!'
    },
    NHnumOfSurgeons: {
        type: Number,
        min: [0, 'NH Start number of Surgeons should be greater than or equal to 0!'],
        required: 'NH Start number of Surgeons is empty!'
    },
    patientHelpTimeInSeconds: {
        type: Number,
        min: [0, 'Patient help time should be greater than 0 seconds!'],
        required: 'Patient help time is empty!'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    },
    author: {
        type: String,
        required: 'Admin session invalid!'
    }
});

gameConfigSchema.pre('validate', function(next) {
    if (this.totalTimeInSeconds < this.patientHelpTimeInSeconds) {
        this.invalidate('totalTimeInSeconds', 'Total time in seconds must be greater than patient help time!',
            this.totalTimeInSeconds);
    }
    next();
});

export default mongoose.model('GameConfig', gameConfigSchema, 'gameConfig');
