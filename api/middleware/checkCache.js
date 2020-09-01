const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
// This function checks the cache to see if requested data is in it.
// If it's in the cache,
const checkCache = (req, res, next) => {
  const user = req.body.user_ID;
  client.get(user, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
};
module.exports = checkCache;
