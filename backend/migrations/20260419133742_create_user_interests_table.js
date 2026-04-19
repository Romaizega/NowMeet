exports.up = function(knex) {
  return knex.schema
    .createTable('user_interests', function (table){
      table.increments('id').primary();
      table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      table
      .integer('interest_id')
      .references('id')
      .inTable('interests')
      .onDelete('CASCADE')
    } )
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_interests')
};
