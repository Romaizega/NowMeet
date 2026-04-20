exports.up = function(knex) {
  return knex.schema
  .createTable('messages', function (table){
    table.increments('id').primary();
    table
    .integer('event_id')
    .references('id')
    .inTable('events')
    .onDelete('CASCADE');
    table
    .integer('user_id')
    .references('id')
    .inTable('users')
    .onDelete('CASCADE');
    table.text('text').notNullable();
    table.timestamps(true, true)
  })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('messages')
};
