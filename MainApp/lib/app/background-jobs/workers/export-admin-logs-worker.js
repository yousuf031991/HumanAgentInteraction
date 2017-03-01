import Utils from '../../helpers/utils';

console.log("Inside Background worker - Export Admin Logs");
console.log("Process " + process.pid);

process.on("message", (msg) => {
    console.log("WORKER got message ------- ");
    console.log(msg);

    if(!Utils.isObject(msg.job) || Utils.isEmptyObject(msg.job)) {
        process.send({type: "error", message: "Job Object cannot be empty"});
    }

    //always check msg type to filter out unnecessary signals
    if(msg.type === "start") {
        // TODO - do all the CPU intensive tasks here


        // notify master that all tasks were successful
        process.send({type: "success"});

    } else if(msg.type === "shutdown") {
        process.exit(0);
    }

});
