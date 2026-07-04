exports.up = function(knex) {
  return knex.schema
  .createTable('event_interests', function (table){
    table.increments('id').primary();
    table
    .integer('event_id')
    .references('id')
    .inTable('events')
    .onDelete('CASCADE');
    table
    .integer('interest_id')
    .references('id')
    .inTable('interests')
    .onDelete('CASCADE');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('event_interests')
};
