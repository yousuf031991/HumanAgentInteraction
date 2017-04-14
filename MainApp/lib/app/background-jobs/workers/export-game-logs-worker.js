import Utils from '../../helpers/utils';
import CSVWriter from 'csv-write-stream';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import UserStatistics from '../../models/userStatistics';
import fs from 'fs';
import setConfigs from '../../configs';
import trustTaskQuestions from '../../configs/trust-task-questions';
import demographicQuestions from '../../configs/demographic-questions';
import connectDB from '../../helpers/db';

const configs = JSON.parse(process.env.CONFIGS);
mongoose.Promise = Promise;

console.log("Inside Background worker - Export GAME Logs");
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

        const csvName = "GameLogs-" + Date.now().toString() + ".csv";
        writer.pipe(fs.createWriteStream(configs.csvPath + csvName));

        UserStatistics.find({"timeOf": {
            "$gte": new Date(job.data.fromDate),
            "$lt": new Date(job.data.toDate)
        }}).exec()
            .then(function (logs) {
                logs.forEach(function (log) {
                    let row = {
                        "Logged At": (new Date(log.timeOf)).toString(),
                        "Username": log.username,
                        "Game Config Id": log.gameConfigId,
                        "Final Score": log.finalScore,
                    };
                    trustTaskQuestions.forEach(function (question) {
                        let matchObj = log.trustAndTaskQuestionnaire.filter(function (resp) {
                            return resp.question === question;
                        });
                        if(matchObj[0] && matchObj[0].response) {
                            row[question] = matchObj[0].response;
                        } else {
                            row[question] = "NA";
                        }
                    });

                    demographicQuestions.forEach(function (question) {
                        let matchObj = log.demographics.filter(function (resp) {
                            return resp.question === question;
                        });
                        if(matchObj[0] && matchObj[0].response) {
                            row[question] = matchObj[0].response;
                        } else {
                            row[question] = "No Response";
                        }
                    });

                    writer.write(row);
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
