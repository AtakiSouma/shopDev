const mongoose = require('mongoose');
const os = require('os');
const process  = require('process');
const _SECONDS = 5000*30;
const countConnect  = () => {
    const numConn  = mongoose.connections.length;
    console.log("NUmber of connections :: " , numConn)
}
// check OverLoad

const checkOverload = () => {
    setInterval(() => {
        const numConn  = mongoose.connections.length;
       const numCores  = os.cpus().length;
       const memoryUsage = process.memoryUsage().rss;

       const maxCon = numCores * 5;
    console.log(`Active connections : ${numConn}`)
    console.log(`Memory Usage : ${memoryUsage / 1024 / 1024} MB`)
       if (numConn > maxCon){
        console.log("Connection overload detected");
       }
    },_SECONDS)
}
module.exports = {
    countConnect,
    checkOverload
}