exports.up = function(knex) {
  return knex.schema
  .createTable('event_participants', function (table){
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
    .onDelete('CASCADE')
    table.string('status',50).notNullable().defaultTo('pending');
    table.timestamp('joined_at');
  })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('event_participants')
};
