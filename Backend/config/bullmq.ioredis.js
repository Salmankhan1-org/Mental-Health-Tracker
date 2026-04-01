const IORedis = require("ioredis");


const isProduction = process.env.NODE_ENV === "production";


const redisOptions = isProduction 
    ? process.env.REDIS_URL 
    : {
        host: "127.0.0.1",
        port: 6379,
      };


const bullMQRedisConnection = new IORedis(redisOptions, {
    maxRetriesPerRequest: null, 
    enableOfflineQueue: true,
    ...(isProduction && {
        tls: {
            rejectUnauthorized: false 
        }
    })
});

bullMQRedisConnection.on("connect", () => {
    console.log(`✅ IO Redis connected (${isProduction ? 'Production/Upstash' : 'Localhost'})`);
});

bullMQRedisConnection.on("error", (err) => {
    console.error("❌ IO Redis error:", err);
});

module.exports = bullMQRedisConnection;