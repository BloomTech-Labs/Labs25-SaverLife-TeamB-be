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

const getMoneyFlow = (user_id) => {
  return dsClient.get(`/${user_id}/moneyflow`);
};

const spendingPost = (request) => {
  return dsClient.post(`/spending`, request);
};

function add(data) {
  return db('graph_data').update(data);
}

module.exports = { getPrediction, getViz, add, spendingPost, getMoneyFlow };
