const supertest = require('supertest');
const server = require('../../api/app.js');

// A 404 status code is a not found error code, if tests
// fail with any other code, please check paths, and assigned error codes

describe('404 status codes for ds POSTs', () => {
  it('should return http status code 404', () => {
    return supertest(server)
      .post('/data/moneyflow/1')
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  it('should return http status code 404', () => {
    return supertest(server)
      .post('/data/futureBudget/1')
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  it('should return http status code 404', () => {
    return supertest(server)
      .post('/data/spending/1')
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
});
