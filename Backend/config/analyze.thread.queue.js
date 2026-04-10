const {Queue} = require('bullmq');
const connection = require('./bullmq.ioredis');

exports.ThreadQueue = new Queue("analyze-thread", {
    connection
})