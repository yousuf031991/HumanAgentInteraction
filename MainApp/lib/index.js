// one time initialization of configs into memory
import setConfigs from './app/configs';

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import path from 'path';
import api from './app/routes/api';
import connectDB from './app/helpers/db';
import session from 'client-sessions';
import Authenticator from './app/helpers/authentication';

const configs = JSON.parse(process.env.CONFIGS);
const app = express();
const port = configs.appPort;
const router = express.Router();
const appRoutes = api(router);

// logging all requests
app.use(morgan('dev'));
app.use(express.static(__dirname + '/../public'));
app.use(session({
    cookieName: configs.session_cookiename,
    secret: configs.session_secret,
    duration: configs.session_duration,
    activeDuration: configs.session_activeDuration,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, configs.views));
connectDB();

app.use(Authenticator.authenticate);
app.use('/api', appRoutes);

app.get('*', function(req, res) {
    res.render('index', {
        user: JSON.stringify(res.locals.user)
    });
});


app.listen(port, function(){
	console.log('Running the server on ' + port);
});