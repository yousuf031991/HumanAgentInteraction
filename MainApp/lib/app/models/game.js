import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    gameConfigId: {
        type: String,
        required: true
    },
    trialInfoId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userStatsId: {
        type: String,
        required: true
    }
});

export default mongoose.model('Game', gameSchema, 'gameinfo');