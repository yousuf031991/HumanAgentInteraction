import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const jobsSchema = new Schema({
    status: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['IN_PROGRESS', 'COMPLETED']
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
    filePath: {
        type: String
    }
});

export default mongoose.model('BackgroundJob', jobsSchema, 'BackgroundJobs');
