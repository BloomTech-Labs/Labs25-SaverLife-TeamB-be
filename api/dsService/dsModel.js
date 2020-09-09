const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);
const db = require('../../data/db-config');

const getPrediction = (x1, x2, x3) => {
  return dsClient.post('/predict', { x1, x2, x3 });
};

const getViz = (user_id) => {
  return dsClient.get(`/viz/${user_id}`);
};

const moneyflowPost = (request) => {
  return dsClient.post(`moneyflow`, request);
};

const spendingPost = (request) => {
  return dsClient.post(`/spending`, request);
};

const futurebudgetPost = (request) => {
  return dsClient.post('/future_budget', request);
};

function add(data) {
  return db('profiles').update(data);
}

const getCurrentMonthSpending = (user_id) => {
  return dsClient.get(`/current_month_spending`, { params: { user_id } });
};

module.exports = {
  getPrediction,
  getViz,
  add,
  spendingPost,
  moneyflowPost,
  futurebudgetPost,
  getCurrentMonthSpending,
};

// Have an array for each (spending/moneyflow) of the data objects and a cache limit(i.e. '4')
// When data is accessed save it to the head of the appropriate array (spending or moneyflow)
// When the cache limit is exceeded, remove the tail end of that array.

// const spendingCacheLimit = 4;

// const spendingCache = [{ data: 'some data 1' }, { data: 'some data 2' }, { data: 'some data 3' }, { data: 'some data 4' }];

// const spendingLRUFunction = (cache, limit, request) => {
//   if (cache.length >= limit - 1) {
//     cache.pop()
//   }
//   cache.unshift(request);
//   return cache;
// };

// spendingLRUFunction(spendingCache, spendingCacheLimit, { data: 'some data 5' });

// // When getting data from backend, first check if its in the cache.

// for (let i = 0; i < spendingCache.length; i++){
//   if (spendingCache[i].data.graph == request){
//     return spendingCache[i]
//   }
//   return spendingPost(request)
// }
