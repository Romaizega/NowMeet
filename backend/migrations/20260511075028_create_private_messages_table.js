
exports.up = function(knex) {
  return knex.schema
    .createTable('private_messages', function(table){
      table.increments('id').primary();
      table
      .integer('sender_user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
      table
      .integer('recipient_user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
      table.text('text').notNullable();
      table.timestamps(true, true)
    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('private_messages')
  
};
