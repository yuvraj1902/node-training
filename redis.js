const redis = require("redis");
const dotenv = require("dotenv").config();

    const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.LOCALHOST);
    redisClient.connect();
    redisClient.on("connect", (err) => {
        console.log("redis connected ");
  
    });

module.exports = redisClient;


