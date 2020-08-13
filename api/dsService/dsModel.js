const axios = require('axios');
const dsConfig = require('../../config/dsConfig');
const dsClient = axios.create(dsConfig);
const db = require('../../data/db-config')

const getPrediction = (x1, x2, x3) => {
  return dsClient.post('/predict', { x1, x2, x3 });
};

const getViz = (state) => {
  return dsClient.get(`/viz/${state}`);
};

function add(data) {
  return db("graph_data").update(data);
}

module.exports = { getPrediction, getViz, findById, add };
