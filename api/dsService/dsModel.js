const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);
const qs = require('qs');
// const db = require('../../data/db-config');

const moneyFlowPost = (request) => {
  return dsClient.post(`moneyflow`, request);
};

const spendingPost = (request) => {
  return dsClient.post(`/spending`, request);
};

const futureBudgetPost = (request) => {
  return dsClient.post('/future_budget', request);
};

const getCurrentMonthSpending = (bank_account_id, categories) => {
  const params = { day_of_month: 1, categories };
  let myAxios = axios.create({
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  return myAxios.get(
    `http://saverlife-a.eba-atdfhqrp.us-east-1.elasticbeanstalk.com/current_month_spending/${bank_account_id}`,
    { params }
  );
};

module.exports = {
  spendingPost,
  moneyFlowPost,
  futureBudgetPost,
  getCurrentMonthSpending,
};
