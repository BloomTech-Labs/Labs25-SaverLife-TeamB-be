const faker = require('faker');

// const profiles = [...new Array(5)].map((i, idx) => ({
//   id: idx === 0 ? '00ulthapbErVUwVJy4x6' : faker.random.alphaNumeric(20),
//   avatarUrl: faker.image.avatar(),
//   email: idx === 0 ? 'llama001@maildrop.cc' : faker.internet.email(),
//   name:
//     idx === 0
//       ? 'Test001 User'
//       : `${faker.name.firstName()} ${faker.name.lastName()}`,
// }));

const profiles = [
  {
    id: '00ulthapbErVUwVJy4x6',
    email: 'llama001@maildrop.cc',
    name: 'Kevin',
    ds_id: '1635ob1dkQIz1QMjLmBpt0E36VyM96ImeyrgZ',
  },
  {
    id: '0oalwu29a8yYgVlp24x6',
    email: 'llama002@maildrop.cc',
    name: 'Test002 User',
    ds_id: 'Plaid_ID 2',
  },
  {
    id: '00ultx74kMUmEW8054x6',
    email: 'llama003@maildrop.cc',
    name: 'Test003 User',
    ds_id: 'Plaid_ID 3',
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('profiles')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('profiles').insert(profiles);
    });
};
