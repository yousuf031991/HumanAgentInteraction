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
    }
});

export default mongoose.model('Jobs', jobsSchema, 'jobs');
