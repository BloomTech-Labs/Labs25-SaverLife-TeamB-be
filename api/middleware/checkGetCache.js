const redis = require('redis');
const REDIS_PORT = process.env.REDIS_URL || 6379;
const client = redis.createClient(REDIS_PORT);
const Profiles = require('../profile/profileModel');

const checkGetCache = async (req, res, next) => {
  const budgetInfo = await Profiles.getBudgetInfoByUserId(req.headers.user_id);
  // getting Bank Account Id from database with user id as an argument
  const { bank_account_id } = await Profiles.getBankAccountId(
    req.headers.user_id
  );
  // adding bank account id to budget info object
  const budgetInfoAndId = { ...budgetInfo, bank_account_id };
  const request = JSON.stringify(budgetInfoAndId);
  client.get(request, (err, data) => {
    if (err) throw err;
    if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
};
module.exports = checkGetCache;
