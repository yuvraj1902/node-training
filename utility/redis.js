const redis = require("redis");
require("dotenv").config();

const getClient = () => {
    return redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
}

let client = getClient();

const connect = () => {
    // if (!client)
    //     client = getClient();
    client.connect();
    client.on("connect", (err) => {
        // if (!err)
        //     console.log("redis connected");
    })
};

const get = async (key) => {
    // if (!client)
    //     client = getClient();
    const data = await client.get(key);
    return data;
};

const set = async (key, value, timeout = { ttl: process.env.REDIS_EXT }) => {
    // if (!client)
    //     client = getClient();
    return await client.set(key, value,  timeout);
};

const reset = async () => {
    // if (!client)
    //     client = getClient();
    return await client.reset();
};

const del = async (key) => {
    // if (!client)
    //     client = getClient();
    return await client.del(key);
};

module.exports = {
    connect,
    get,
    set,
    reset,
    del
};