exports.up = function(knex) {
  return knex.schema.alterTable('interests', function (table) {
    table.string('category').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('interests', (table) => {
    table.dropColumn('category')
  })
};
