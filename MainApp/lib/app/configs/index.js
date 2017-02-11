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
configs.session_secret = "softwarefactory_ser518_human_agent_interaction_project";
configs.session_duration = 30 * 60 * 100 * 1000; // in ms
configs.session_activeDuration = 5 * 60 * 100 * 1000; // in ms
configs.session_cookiename = "session";

// set the configs as an env variable
process.env.CONFIGS = JSON.stringify(configs);
