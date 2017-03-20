import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const jobsSchema = new Schema({
    status: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['IN_PROGRESS', 'SUCCESSFUL', 'UNSUCCESSFUL']
    },
    type: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['ADMIN_LOGS', 'GAME_LOGS']
    },
    data: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    retryCount: {
        type: Number,
        default: 0
    },
    outputFileName: {
        type: String
    },
    author: {
        type: String
    }
});

export default mongoose.model('BackgroundJob', jobsSchema, 'BackgroundJobs');
