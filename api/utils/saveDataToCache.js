const redis = require('redis');
const REDIS_PORT = process.env.REDIS_URL || 6379;
const client = redis.createClient(REDIS_PORT);

const saveDataToCache = async (requestBody, res) => {
  try {
    const request = requestBody;
    const response = JSON.stringify(res);
    client.setex(request, 14400, response);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};
module.exports = saveDataToCache;
