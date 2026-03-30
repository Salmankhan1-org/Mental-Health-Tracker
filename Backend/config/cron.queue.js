// queues/cron.queue.js
const { Queue } = require("bullmq");
const connection = require('./bullmq.ioredis.js');

const cronQueue = new Queue("cron-jobs", {
    connection,
});

module.exports = cronQueue;