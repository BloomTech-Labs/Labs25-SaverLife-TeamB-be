const db = require('../../data/db-config');

const findAll = async () => {
  return await db('profiles');
};

const findBy = (filter) => {
  return db('profiles').where(filter);
};

const findById = async (id) => {
  return db('profiles').where({ id }).first().select('*');
};

const create = async (profile) => {
  return db('profiles').insert(profile).returning('*');
};

const update = (id, profile) => {
  console.log(profile);
  return db('profiles')
    .where({ id: id })
    .first()
    .update(profile)
    .returning('*');
};

const remove = async (id) => {
  return await db('profiles').where({ id }).del();
};

const getBankAccountId = (id) => {
  return db('profiles').where({ id }).select('bank_account_id').first();
};

const updateProfileById = (id, item) => {
  return db('profiles').where({ id }).update(item);
};

const getBudgetInfoByUserId = (id) => {
  return db('profiles')
    .where({ id })
    .select('monthly_savings_goal', 'categories')
    .first();
};
module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  updateProfileById,
  getBankAccountId,
  getBudgetInfoByUserId,
};
