import Utils from '../../helpers/utils';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import AdminLog from '../../models/adminLog';
import setConfigs from '../../configs';
import connectDB from '../../helpers/db';
import Excel from 'exceljs';


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
        const xlsxName = "AdminLogs-" + Date.now().toString() + ".xlsx";
        const finalPath = configs.csvPath + xlsxName;

        let workbook = new Excel.Workbook();
        workbook.creator = 'System Generated';
        workbook.created = new Date();

        AdminLog.find({"timeOf": {
                "$gte": new Date(job.data.fromDate),
                "$lt": new Date(job.data.toDate)
            }}).exec()
            .then(function (logs) {

                let sheet = workbook.addWorksheet('Admin Logs');
                sheet.columns = [
                    { header: 'Logged At', key: 'log', width: 14 },
                    { header: 'Action', key: 'action', width: 50 },
                    { header: 'Author', key: 'author', width: 20 }
                ];

                logs.forEach(function (log) {
                    sheet.addRow({
                        log: new Date(log.timeOf),
                        action: log.action,
                        author: log.author
                    });
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
