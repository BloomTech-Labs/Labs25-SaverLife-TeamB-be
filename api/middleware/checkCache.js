const redis = require('redis');
const REDIS_PORT = process.env.REDIS_URL || 6379;
const client = redis.createClient(REDIS_PORT);

const checkCache = (req, res, next) => {
  const request = JSON.stringify(req.body);
  client.get(request, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
};
module.exports = checkCache;
