import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const manageAdminSchema = new Schema({
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    role:{
        type: String,
        uppercase: true,
        required: true,
        enum: ['ADMIN', 'SUPER ADMIN']
    }
});

export default mongoose.model('ManageAdmin', manageAdminSchema, 'admins');
