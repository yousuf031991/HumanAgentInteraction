let configs = {};

configs.mode = process.env.NODE_ENV || "development";
if(configs.mode === "production") {
    configs.appPort = process.env.PORT || 8080;
    configs.mongoHost = 'localhost:27017';
    configs.database = 'hospital';
    configs.totalConnections = 15;
    configs.connectionTimeout = 10000;
} else {
    // development
    configs.appPort = process.env.PORT || 8080;
    configs.mongoHost = 'localhost:27017';
    configs.database = 'hospital';
    configs.totalConnections = 10;
    configs.connectionTimeout = 5000;
}
configs.homeRoute = '/../public/app/views/index.html';
configs.loginRoute = '/../public/app/views/google-Login.html';

// set the configs as an env variable
process.env.CONFIGS = JSON.stringify(configs);
