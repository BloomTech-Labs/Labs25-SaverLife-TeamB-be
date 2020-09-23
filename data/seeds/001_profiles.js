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
    bank_account_id: 131952,
  },
  {
    id: '00ultwew80Onb2vOT4x6',
    email: 'llama002@maildrop.cc',
    name: 'James',
    bank_account_id: 3127,
    monthly_savings_goal: 250,
    categories: [
      'Financial',
      'Food',
      'Shopping',
      'Transportation',
      'Utilities',
      'Misc.',
    ],
  },
  {
    id: '00ultx74kMUmEW8054x6',
    email: 'llama003@maildrop.cc',
    name: 'Alice',
    bank_account_id: 166090,
    monthly_savings_goal: 300,
    categories: [
      'Food',
      'Payments',
      'Shopping',
      'Transportation',
      'Utilities',
      'Misc.',
    ],
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
