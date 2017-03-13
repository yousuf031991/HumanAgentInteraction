import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminLogsSchema = new Schema({
    timeOf: {
        type: Date,
        default: Date.now
    },
    action: {
        type: String,
        required: true
    }
});

export default mongoose.model('AdminLog', adminLogsSchema, 'adminLogs');
