const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
// This function checks the cache to see if requested data is in it.
// If it's in the cache,
const checkCache = (req, res, next) => {
  console.log('Checking Cache...');
  const user = req.body.user_ID;
  console.log('ITS HERE', req.body)
  client.get(user, (err, data) => {
    if (err) {
      console.log('error', err);
      throw err;
    } 
    if (data !== null) {
      console.log('data', data);
      res.send(data);
    } else {
      console.log('not in cache', data);
      next();
    }
  });
};
module.exports = checkCache;
