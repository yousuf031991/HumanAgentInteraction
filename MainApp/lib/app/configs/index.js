import path from 'path';
let configs = {};

configs.mode = process.env.NODE_ENV || "development";
if(configs.mode === "production") {
    configs.appPort = process.env.PORT || 8080;
    configs.mongoHost = 'localhost:27017';
    configs.database = 'hospital';
    configs.totalConnections = 15;
    configs.connectionTimeout = 10000;
    configs.backgroundJobsPath = path.join(process.cwd(), "dist/app/background-jobs");
} else {
    // development
    configs.appPort = process.env.PORT || 8080;
    configs.mongoHost = 'localhost:27017';
    configs.database = 'hospital';
    configs.totalConnections = 10;
    configs.connectionTimeout = 5000;
    configs.backgroundJobsPath = path.join(process.cwd(), "lib/app/background-jobs");
}
configs.backgroundJobsModules = {
    "ADMIN_LOGS": "export-admin-logs-worker.js",
    "GAME_LOGS": "export-game-logs-worker.js"
};
configs.maxRetryCount = 3; // max times a background job will be retried
configs.maxConcurrentBackgroundJobs = 1; // this is the size of the queue which is used for running background jobs
configs.views = '/../public/app/views';
configs.session_secret = "softwarefactory_ser518_human_agent_interaction_project";
configs.session_duration = 30 * 60 * 100 * 1000; // in ms
configs.session_activeDuration = 5 * 60 * 100 * 1000; // in ms
configs.session_cookiename = "session";

// set the configs as an env variable
process.env.CONFIGS = JSON.stringify(configs);
