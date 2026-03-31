const IORedis = require("ioredis");

const bullMQRedisConnection = new IORedis(process.env.REDIS_URL,{
    maxRetriesPerRequest: null, 
    // enableOfflineQueue: true, 
});

bullMQRedisConnection.on("connect", () => console.log("✅IO Redis connected.........."));
bullMQRedisConnection.on("error", (err) => console.error("IO Redis error:", err));

module.exports = bullMQRedisConnection