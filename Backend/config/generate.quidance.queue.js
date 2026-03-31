const {Queue} = require('bullmq');
const connection = require('./bullmq.ioredis');

exports.GuidanceQueue = new Queue("guidance-queue", {
    connection
})