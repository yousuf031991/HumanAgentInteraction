import BackgroundJob from '../models/background-job';
import Promise from 'bluebird';
import Utils from './utils';
import executeJobs from '../background-jobs';

const configs = JSON.parse(process.env.CONFIGS);

function isQueueAvailable() {
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

function queueJob(type, data) {
    if(!type || Utils.isEmptyObject(data)) return Promise.reject({message: "Type or Data cannot be empty"});

    const job = new BackgroundJob();
    job.status = "IN_PROGRESS";
    job.type = type;
    job.data = data;
    return job.save();
}

function dequeueJob(jobID) {
    if(!jobID) return Promise.reject("JobID cannot be empty");
    return BackgroundJob.findByIdAndUpdate(jobID, {
        $set: { status: "COMPLETED" }
    });
}

function retryJob(jobID) {
    // TODO
}

function executeQueue() {
    return BackgroundJob.find({ status: "IN_PROGRESS"})
        .sort({createdAt: 'desc'}).exec()
        .then(function (jobs) {
            return executeJobs(jobs);
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

export default {
    isQueueAvailable: isQueueAvailable,
    queueJob: queueJob,
    dequeueJob: dequeueJob,
    retryJob: retryJob,
    executeQueue: executeQueue
}