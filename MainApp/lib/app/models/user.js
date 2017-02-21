import mongoose from 'mongoose';
const validate = require('mongoose-validator');

const Schema = mongoose.Schema;

const emailValidator=[ 

validate({
    validator: 'matches',
    arguments:['^.*@asu.edu$'],
    message:'Please Enter Valid ASU Email Id'
}
)
];

const adminSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: emailValidator
    },
    role: {
        type: String,
        uppercase: true,
        required: true,
        enum: ['ADMIN', 'SUPER ADMIN']
    },
    fullname: {
        type: String
    }
});

export default mongoose.model('Admin', adminSchema, 'admin');
