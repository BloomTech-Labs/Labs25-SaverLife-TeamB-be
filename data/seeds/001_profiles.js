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
    monthly_savings_goal: 400,
    placeholder: 'Auto, Financial, Food',
  },
  {
    id: '0oalwu29a8yYgVlp24x6',
    email: 'llama002@maildrop.cc',
    name: 'James',
    ds_id: 'mEQmv8ybP1t3o3bYnKzwFqP5jad1KKUM8N06o',
    monthly_savings_goal: 250,
    placeholder: 'Shopping, Transportation, Financial',
  },
  {
    id: '00ultx74kMUmEW8054x6',
    email: 'llama003@maildrop.cc',
    name: 'Alice',
    ds_id: 'vq4mMRdZLeFon7bK63jefLOomaRPYBCmAJP6g',
    monthly_savings_goal: 550,
    placeholder: 'Utilities, Food, Transportation',
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
