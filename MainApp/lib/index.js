import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import api from './app/routes/api';
import connectDB from './app/helpers/db';

const app = express();
const port = process.env.PORT || 8080; // TODO move to constants
const router = express.Router();
const appRoutes = api(router);

// logging all requests
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static(__dirname + '/../public'));
app.use('/api', appRoutes);
connectDB();

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/../public/app/views/index.html'));
});

app.listen(port, function(){
	console.log('Running the server on ' + port);
});