import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

adminSchema.pre('save', function (next) {
    let currentAdmin = this;
    bcrypt.hash(currentAdmin.password, null, null, function (err, hash) {
        if (err) return next(err);
        currentAdmin.password = hash;
        next();
    });
});

export default mongoose.model('Admin', adminSchema, 'admin');
