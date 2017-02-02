var Admin = require('../models/admins');

module.exports.create = function(req, res) {
	var admin = new Admin(req.body);
	admin.save(function(err, result) {
		res.json(result);
	});
}

module.exports.list = function (req, res) {
  Admin.find({}, function (err, results) {
    res.json(results);
  });
}