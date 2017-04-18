import BackgroundJob from '../models/background-job';
import Promise from 'bluebird';
import Utils from '../helpers/utils';
import initiateWorker from './initiate-worker'
import fs from 'fs';
import path from 'path';
const configs = JSON.parse(process.env.CONFIGS);

function checkAvailability() {
    return BackgroundJob.find({status: "IN_PROGRESS"}).exec()
        .then(function (jobs) {
            if(jobs.length < configs.maxConcurrentBackgroundJobs) {
                return Promise.resolve({isAvailable: true});
            } else {
                return Promise.resolve({
                    isAvailable: false,
                    message: "The background jobs queue is full right now. Please try again later."
                });
            }
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

function queueJob(type, username, data) {
    if(!type || Utils.isEmptyObject(data)) return Promise.reject({message: "Type or Data cannot be empty"});

    let job = new BackgroundJob();
    job.status = "IN_PROGRESS";
    job.type = type;
    job.author = username;
    job.data = data;
    return job.save();
}

function dequeueJob(jobID, fileName) {
    if(!jobID) return Promise.reject({message: "JobID cannot be empty"});
    return BackgroundJob.findByIdAndUpdate(jobID, {
        $set: {
            status: "SUCCESSFUL",
            completedAt: Date.now(),
            outputFileName: fileName
        }
    }).exec();
}

function retryJob(jobID) {
    if(!jobID) return Promise.reject({message: "JobID cannot be empty"});
    return BackgroundJob.findById(jobID).exec()
        .then(function (job) {
            if(job.retryCount < configs.maxRetryCount) {
                job.retryCount = job.retryCount + 1;
                console.log("BACKGROUND JOB ------ RETRYING A JOB NOW " + job.retryCount);
                executeJob(job);
            } else {
                job.status = "UNSUCCESSFUL";
                console.log("BACKGROUND JOB ------ UNSUCCESSFUL");
            }
            return job;
        })
        .then(function (job) {
            return job.save();
        })
        .catch(function (error) {
            console.error(error);
        });
}

function executeJob(job) {
    if(!Utils.isObject(job)) return Promise.reject({message: "Job is not an object"});
    if(Utils.isEmptyObject(job)) return Promise.reject({message: "Job cannot be empty"});
    return initiateWorker(job);
}

function runInProgressJobs() {
    BackgroundJob.find({status: "IN_PROGRESS"}).exec()
        .then(function (jobs) {
            jobs.forEach(function (job) {
                executeJob(job);
            });
        });
}

function deleteOldFiles() {
    const diffDate = new Date();
    diffDate.setDate(diffDate.getDate() - configs.csvExpiryDays);
    BackgroundJob.find({status: { $in: ["UNSUCCESSFUL", "SUCCESSFUL"] } }).exec()
        .then(function (jobs) {
            jobs.forEach(function (job) {
                let jobDate = new Date(job.createdAt);
                if(diffDate > jobDate) {
                    if(job.outputFileName) {
                        const fileName = path.join(__dirname, '..', '..', '..', configs.csvPath, job.outputFileName);
                        fs.unlink(fileName, function (err) {
                            if(err) {
                                console.log("Error while delete file",  err);
                            } else {
                                console.log("Deleted file", job.outputFileName);
                            }
                        });
                    }
                    job.remove();

                }
            });
        })
        .catch(function (err) {
           console.log("ERROR IN deleteOldFiles" + err);
        });
}

export default {
    checkAvailability: checkAvailability,
    queueJob: queueJob,
    dequeueJob: dequeueJob,
    retryJob: retryJob,
    executeJob: executeJob,
    runInProgressJobs: runInProgressJobs,
    deleteOldFiles: deleteOldFiles
}