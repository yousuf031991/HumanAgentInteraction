import Jobs from '../models/jobs';
import Promise from 'bluebird';
const configs = JSON.parse(process.env.CONFIGS);

function isQueueAvailable() {
    return Jobs.find({status: "IN_PROGRESS"}).exec()
        .then(function (jobs) {
            if(jobs.length < configs.maxConcurrentBackgroundJobs) {
                return Promise.resolve({data: true});
            } else {
                return Promise.resolve({
                    data: false,
                    message: "The background jobs queue is full right now. Please try again later."
                });
            }
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

export default {
    isQueueAvailable: isQueueAvailable
}