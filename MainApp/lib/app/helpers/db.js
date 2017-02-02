import mongoose from 'mongoose';

const configs = JSON.parse(process.env.CONFIGS);
const dbURI = "mongodb://" + configs.mongoHost + "/" + configs.database;
const options = {
    replset: {
        socketOptions: { connectTimeoutMS : configs.connectionTimeout }
    },
    server: { poolSize: configs.totalConnections }
};

export default function connectDB() {
    mongoose.connect(dbURI, options);

    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + dbURI);
    });

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection disconnected');
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
}
