const supertest = require('supertest');
const server = require('../../api/app.js');

// const redis = require("redis-mock"),
//     client = redis.createClient();

// A 401 status code means request has not been applied
// because it lacks valid authentication credentials for the target resource
// If tests fail with 404 or 500 it means authentication is not
// working as intended

describe('401 status codes for ds POSTs', () => {
  it('should return http status code 401', () => {
    return supertest(server)
      .post('/data/moneyflow')
      .then((response) => {
        expect(response.status).toBe(401);
      });
  });

  it('should return http status code 401', () => {
    return supertest(server)
      .post('/data/futureBudget')
      .then((response) => {
        expect(response.status).toBe(401);
      });
  });

  it('should return http status code 401', () => {
    return supertest(server)
      .post('/data/spending')
      .then((response) => {
        expect(response.status).toBe(401);
      });
  });
});
