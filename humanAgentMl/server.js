var express           = require('express'),
    app               = express(),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    adminsController = require('./server/controllers/admins-controller');

mongoose.connect('mongodb://localhost:27017/admins');

app.use(bodyParser());

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/views/index.html');
});

app.get('/login',function(req,res){
	res.sendfile(__dirname + '/client/views/google-Login.html');
}
);

app.use('/js', express.static(__dirname + '/client/js'));

//REST API
app.get('/api/admins', adminsController.list);
app.post('/api/admins', adminsController.create);
app.post('/api/adminLogin',adminsController.checkAdmin);


app.listen(3000, function() {
  console.log('I\'m Listening...');
})