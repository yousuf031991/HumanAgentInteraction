import childProcess from 'child_process';
import path from 'path';
import Promise from 'bluebird';
import ps from "ps-node";
import WorkerQueue from "./worker-queue";

const pidLookup = Promise.promisify(ps.lookup);
const configs = JSON.parse(process.env.CONFIGS);

export default function initiateWorker(job) {
    const workerPath = getChildProcessPath(job);
    const worker = childProcess.fork(workerPath);

    worker.on("message", (msg) => {
        console.log('PARENT got message ---- ' + msg.type);

        //always check msg type to filter out unnecessary signals
        if(msg.type === "initiationComplete") {
            worker.send({ type: 'start', job: job });
            return;
        } else if(msg.type === "success") {
            WorkerQueue.dequeueJob(job._id, msg.fileName);
        } else if(msg.type === "error") {
            console.error("CHILD PROCESS RETURNED ERROR MESSAGE");
            console.error(msg);
            WorkerQueue.retryJob(job._id);
        }

        killChild(worker, job);

    });

    worker.on("exit", (code) => {
        if(code === 1) {
            console.log("Fatal Error from child process");
            // fatal error. hit retry
            WorkerQueue.retryJob(job._id);
        }
    });

    worker.send({ type: 'initiate', job: job });

    return Promise.resolve();
}

function killChild(worker, job) {
    worker.send({ type: "shutdown", job: job});

    setTimeout(function () {
        pidLookup({ pid: worker.pid })
            .then(function (list) {
                if(list[0]) {
                    // worker did not act upon shutdown msg
                    // force shutdown
                    worker.kill('SIGKILL');
                }
            })
            .catch(function (error) {
                console.error("Damn!!");
                console.error(error);
            });
    }, 5000);

}

function getChildProcessPath(job) {
    const modulePath = configs.backgroundJobsModules[job.type];
    if(!modulePath) throw new Error("Invalid Job Type: " + job.type + ". Contact Administrator.");

    return path.join(configs.backgroundJobsPath, path.join("workers", modulePath));
}
