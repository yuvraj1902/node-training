const redis = require("redis");
require("dotenv").config();

const getClient = () => {
    return redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
}

let client = getClient();

const connect = () => {
    client.connect();
};

const get = async (key) => {
    
    const data = await client.get(key);
    console.log(data);
    return data;
};

const set = async (key, value) => {
    
    return await client.set(key, value, { EX: process.env.REDIS_EXT });
};

const reset = async () => {
    
  return await client.reset();
};

const del = async (key) => {
    
  return await client.del(key);
};

module.exports = {
  connect,
  get,
  set,
  reset,
  del
};