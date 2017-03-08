import BackgroundJob from '../models/background-job';
import Promise from 'bluebird';
import Utils from '../helpers/utils';
import initiateWorker from './initiate-worker'
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

function queueJob(type, data) {
    if(!type || Utils.isEmptyObject(data)) return Promise.reject({message: "Type or Data cannot be empty"});

    let job = new BackgroundJob();
    job.status = "IN_PROGRESS";
    job.type = type;
    job.data = data;
    return job.save();
}

function dequeueJob(jobID) {
    if(!jobID) return Promise.reject({message: "JobID cannot be empty"});
    return BackgroundJob.findByIdAndUpdate(jobID, {
        $set: {
            status: "SUCCESSFUL",
            completedAt: Date.now()
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

export default {
    checkAvailability: checkAvailability,
    queueJob: queueJob,
    dequeueJob: dequeueJob,
    retryJob: retryJob,
    executeJob: executeJob
}