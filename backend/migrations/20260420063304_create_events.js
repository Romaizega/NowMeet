exports.up = function(knex) {
  return knex.schema
    .createTable('events', function (table){
      table.increments('id').primary();
      table.string('title').notNullable();
      table.text('description', 250).nullable();
      table
        .integer('creator_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('event_start').notNullable();
      table.integer('duration').notNullable();
      table.integer('max_participants');  
      table.string('place_name', 50).nullable();
      table.float('latitude');
      table.float('longitude');
      table.string('status',50).notNullable().defaultTo('open');
      table.timestamps(true, true)
    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('events')
};
