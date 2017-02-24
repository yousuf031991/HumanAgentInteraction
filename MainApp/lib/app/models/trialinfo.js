import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const trialInfoSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true
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

export default mongoose.model('TrialInfo', trialInfoSchema, 'trialinfo');
