exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('country').nullable()
    table.string('city').nullable()
  })
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('country')
    table.dropColumn('city')
  })
};
