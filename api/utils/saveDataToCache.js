const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
// This function saves data into a cache.
const saveDataToCache = async (user_ID, res) => {
  try {
    console.log('Caching Data...');
    const user = user_ID;
    const response = res.data;
    client.setex(user, 100000, response);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
module.exports = saveDataToCache;
