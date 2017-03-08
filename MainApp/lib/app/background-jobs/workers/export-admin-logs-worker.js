import Utils from '../../helpers/utils';

console.log("Inside Background worker - Export Admin Logs");
console.log("Process " + process.pid);

process.on("message", (msg) => {
    console.log("WORKER got message ------- ");
    console.log(msg);

    if(msg.type === "shutdown") {
        process.exit(0);
    }

    if(!Utils.isObject(msg.job) || Utils.isEmptyObject(msg.job)) {
        process.send({type: "error", message: "Job Object cannot be empty"});
        return;
    }

    //always check msg type to filter out unnecessary signals
    if(msg.type === "start") {
        // TODO - do all the CPU intensive tasks here

        setTimeout(function () {
            // notify master that all tasks were successful
            process.send({type: "success"});
        }, 50000);

    }

});
