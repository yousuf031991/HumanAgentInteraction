import ChildProcess from 'child_process';

const configs = JSON.parse(process.env.CONFIGS);

export default function executeJobs(jobs) {

    // TODO - loop over jobs and execute them according to their type
    const modulePath = getModulePath(jobs[0]);
}

function getModulePath(job) {
    const modulePath = configs.backgroundJobsModules[job.type];
    if(!modulePath) throw new Error("Invalid Job Type: " + job.type + ". Contact Administrator.");

    return path.join(modulePath, "master.js");
}
