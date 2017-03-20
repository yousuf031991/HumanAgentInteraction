import Utils from '../../helpers/utils';
import CSVWriter from 'csv-write-stream';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import AdminLog from '../../models/adminLog';
import fs from 'fs';
import setConfigs from '../../configs';
import connectDB from '../../helpers/db';

const configs = JSON.parse(process.env.CONFIGS);
mongoose.Promise = Promise;

console.log("Inside Background worker - Export Admin Logs");
console.log("Process " + process.pid);

process.on("message", (msg) => {
    console.log("WORKER got message --- " + msg.type);

    if(msg.type === "shutdown") {
        process.exit(0);
    }

    if(!Utils.isObject(msg.job) || Utils.isEmptyObject(msg.job)) {
        process.send({type: "error", message: "Job Object cannot be empty"});
        return;
    }

    //always check msg type to filter out unnecessary signals
    if(msg.type === "initiate") {
        connectDB();
        process.send({type: "initiationComplete"});
    } else if(msg.type === "start") {
        const job = msg.job;
        let writer = CSVWriter();

        const csvName = "AdminLogs-" + Date.now().toString() + ".csv";
        writer.pipe(fs.createWriteStream(configs.csvPath + csvName));

        AdminLog.find({"timeOf": {
                "$gte": new Date(job.data.fromDate),
                "$lt": new Date(job.data.toDate)
            }}).exec()
            .then(function (logs) {
                logs.forEach(function (log) {
                    writer.write({
                        "Logged At": (new Date(log.timeOf)).toString(),
                        "Action": log.action,
                        "Author": log.author
                    });
                });
            })
            .then(function () {
                writer.end();
            })
            .then(function () {
                process.send({type: "success", fileName: csvName});
            })
            .catch(function (error) {
                process.send({type: "error", message: error.message});
            });

    }

});
