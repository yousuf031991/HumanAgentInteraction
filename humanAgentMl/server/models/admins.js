var mongoose = require('mongoose');

module.exports= mongoose.model('Admin', {
	name: String,
	password: String
});