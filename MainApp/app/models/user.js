var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var ObjectID = require('mongodb').ObjectID;
var conn = mongoose.connection;

var adminSchema = new Schema({
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
    var currentAdmin = this;
    bcrypt.hash(currentAdmin.password, null, null, function (err, hash) {
        if (err) return next(err);
        currentAdmin.password = hash;
        next();
    });
});

module.exports = mongoose.model('Admin', adminSchema, 'admin');

// Adding default super admin into db

var superadmin = {
    _id: new ObjectID(),
    username: 'superadmin',
    password: 'Admin1!'
   
};

conn.collection('admin').insert(superadmin);