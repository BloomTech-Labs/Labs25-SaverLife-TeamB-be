exports.up = async function (knex) {
  await knex.schema.createTable('graph_data', (data) => {
    data.increments();
    data.specificType('data', 'jsonb[]');
    data.specificType('layout', 'jsonb');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('graph_data');
};
