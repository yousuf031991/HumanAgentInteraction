import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    role: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['ADMIN', 'SUPER ADMIN']
    }
});

export default mongoose.model('Admin', adminSchema, 'admin');
