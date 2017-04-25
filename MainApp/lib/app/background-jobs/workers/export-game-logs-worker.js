import Utils from '../../helpers/utils';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import UserStatistics from '../../models/userStatistics';
import setConfigs from '../../configs';
import trustTaskQuestions from '../../configs/trust-task-questions';
import demographicQuestions from '../../configs/demographic-questions';
import connectDB from '../../helpers/db';
import Excel from 'exceljs';

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
        const xlsxName = "GameLogs-" + Date.now().toString() + ".xlsx";
        const finalPath = configs.csvPath + xlsxName;

        let workbook = new Excel.Workbook();
        workbook.creator = 'System Generated';
        workbook.created = new Date();


        UserStatistics.find({"timeOf": {
            "$gte": new Date(job.data.fromDate),
            "$lt": new Date(job.data.toDate)
        }}).exec()
            .then(function (logs) {
                let sheetMoves = workbook.addWorksheet('Moves');
                let sheetQuestions = workbook.addWorksheet('Questionnaire');

                sheetMoves.columns = [
                    { header: 'Logged At', key: 'loggedAt', width: 15 },
                    { header: 'User ID', key: 'userID', width: 15 },
                    { header: 'Move Info', key: 'moveInfo', width: 15 },
                    { header: 'Main Time Left', key: 'mainTimeLeft', width: 15 },
                    { header: '#Nurses', key: 'numberOfNurses', width: 10 },
                    { header: '#Doctors', key: 'numberOfDoctors', width: 10 },
                    { header: '#Surgeons', key: 'numberOfSurgeons', width: 10 },
                    { header: '#Other Nurses', key: 'otherNumberOfNurses', width: 10 },
                    { header: '#Other Doctors', key: 'otherNumberOfDoctors', width: 10 },
                    { header: '#Other Surgeons', key: 'otherNumberOfSurgeons', width: 10 },
                    { header: '#PatientAs', key: 'numberOfPatientAs', width: 10 },
                    { header: '#PatientBs', key: 'numberOfPatientBs', width: 10 },
                    { header: '#Other PatientAs', key: 'otherNumberOfPatientAs', width: 10 },
                    { header: '#Other PatientBs', key: 'otherNumberOfPatientBs', width: 10 },
                    { header: 'Score', key: 'score', width: 10 },
                    { header: 'Other Score', key: 'otherScore', width: 10 },
                    { header: 'Total Score', key: 'totalScore', width: 10 }
                ];

                let questionsColumnArray = [
                    { header: 'Logged At', key: 'loggedAt', width: 15 },
                    { header: 'User ID', key: 'userID', width: 15 },
                    { header: 'Game Config Id', key: 'gameConfigId', width: 15 },
                    { header: 'Final Score', key: 'finalScore', width: 10 },
                    { header: 'Times Game Loaded', key: 'timesGameLoaded', width: 10 },
                    { header: 'Version Num', key: 'versionNum', width: 10 }
                ];
                let counter = 0;
                trustTaskQuestions.forEach(function (question) {
                    questionsColumnArray.push({
                        header: question,
                        key: "question" + counter,
                        width: 15
                    });
                    counter++;
                });

                demographicQuestions.forEach(function (question) {
                    questionsColumnArray.push({
                        header: question,
                        key: "question" + counter,
                        width: 15
                    });
                    counter++;
                });

                sheetQuestions.columns = questionsColumnArray;

                logs.forEach(function (log) {

                    log.moves.forEach(function (move) {
                        sheetMoves.addRow({
                            loggedAt: new Date(log.timeOf),
                            userID: log.username,
                            moveInfo: move.moveInfo,
                            mainTimeLeft: move.mainTimeLeft,
                            numberOfNurses: move.numberOfNurses,
                            numberOfDoctors: move.numberOfDoctors,
                            numberOfSurgeons: move.numberOfSurgeons,
                            otherNumberOfNurses: move.otherNumberOfNurses,
                            otherNumberOfDoctors: move.otherNumberOfDoctors,
                            otherNumberOfSurgeons: move.otherNumberOfSurgeons,
                            numberOfPatientAs: move.numberOfPatientAs,
                            numberOfPatientBs: move.numberOfPatientBs,
                            otherNumberOfPatientAs: move.otherNumberOfPatientAs,
                            otherNumberOfPatientBs: move.otherNumberOfPatientBs,
                            score: move.score,
                            otherScore: move.otherScore,
                            totalScore: move.totalScore
                        });
                    });


                    let questionRow = {
                        loggedAt: (new Date(log.timeOf)),
                        userID: log.username,
                        gameConfigId: log.gameConfigId,
                        finalScore: log.finalScore,
                        timesGameLoaded: log.timesGameLoaded,
                        versionNum: log.versionNum
                    };

                    let counter = 0;
                    trustTaskQuestions.forEach(function (question) {
                        let matchObj = log.trustAndTaskQuestionnaire.filter(function (resp) {
                            return resp.question === question;
                        });
                        let key = "question" + counter;
                        if(matchObj[0] && matchObj[0].response) {
                            questionRow[key] = matchObj[0].response;
                        } else {
                            questionRow[key] = "NA";
                        }
                        counter++;
                    });

                    demographicQuestions.forEach(function (question) {
                        let matchObj = log.demographics.filter(function (resp) {
                            return resp.question === question;
                        });
                        let key = "question" + counter;
                        if(matchObj[0] && matchObj[0].response) {
                            questionRow[key] = matchObj[0].response;
                        } else {
                            questionRow[key] = "No Response";
                        }
                        counter++;
                    });

                    sheetQuestions.addRow(questionRow);


                });
            })
            .then(function () {
                return workbook.xlsx.writeFile(finalPath);
            })
            .then(function () {
                process.send({type: "success", fileName: xlsxName});
            })
            .catch(function (error) {
                process.send({type: "error", message: error.message});
            });

    }

});
