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
configs.googleClientId = "79517414502-p33r8rq5viqvrb35ukgrdd0fk3a2mr8j.apps.googleusercontent.com";

// set the configs as an env variable
process.env.CONFIGS = JSON.stringify(configs);
