const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);
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

const getCurrentMonthSpending = (bank_account_id) => {
  return dsClient.get(`/current_month_spending/${bank_account_id}`);
};

module.exports = {
  spendingPost,
  moneyFlowPost,
  futureBudgetPost,
  getCurrentMonthSpending,
};
