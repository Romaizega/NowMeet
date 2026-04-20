exports.up = function(knex) {
  return knex.schema
  .createTable('reviews', function (table){
    table.increments('id').primary();
    table
    .integer('author_id')
    .references('id')
    .inTable('users')
    .onDelete('CASCADE');
    table
    .integer('reviewed_user_id')
    .references('id')
    .inTable('users')
    .onDelete('CASCADE');
    table
    .integer('event_id')
    .references('id')
    .inTable('events')
    .onDelete('CASCADE');
    table.text('review').notNullable();
    table.integer('rating').notNullable();
    table.timestamp('created_at');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reviews')
  
};
