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

module.exports.checkAdmin= function(req,res){
   var admin=new Admin();
   var emailID=req.body.email;
   console.log("Email:"+emailID);
   Admin.count({name: emailID},function(err,count){
      if(count>0){
         res.send(true);
      }
      else{
         res.send(false);
      }
   });
}